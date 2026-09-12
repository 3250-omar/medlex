import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length)
    env[k.trim()] = v
      .join("=")
      .trim()
      .replace(/^["']|["']$/g, "");
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const htmlFilePath = path.resolve(
  process.cwd(),
  "public/images/sectionImages/CASC Academy 38 Station 7 2 The Angry Father.html"
);

if (!fs.existsSync(htmlFilePath)) {
  console.error("HTML file not found at:", htmlFilePath);
  process.exit(1);
}

const fileRawHtml = fs.readFileSync(htmlFilePath, "utf8");

// Extract body and clean it following project standard (like scripts/generate-casc-static-seed.ps1)
const bodyMatch = fileRawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.error("Could not find <body> tags in HTML file");
  process.exit(1);
}

let body = bodyMatch[1];
// Strip script, style, img, and inline on... event handlers
body = body.replace(/<script\b[\s\S]*?<\/script>/gi, "");
body = body.replace(/<style\b[\s\S]*?<\/style>/gi, "");
body = body.replace(/<img\b[^>]*>/gi, "");
body = body.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*')/gi, "");

// Standardize continue button link to 46_Station_7.3_Breaking_Bad_News.html for consistent routing
body = body.replace(
  /href="CASC_Academy_39_Station_7_3_Breaking_Bad_News\.html"/g,
  'href="46_Station_7.3_Breaking_Bad_News.html"'
);

const cleanedHtml = "\n\n" + body.trim() + "\n\n";

console.log("Extracted and cleaned HTML size:", cleanedHtml.length, "characters");

async function runSeed() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  // 1. Find learning unit for Station 7.2
  const unitRes = await fetch(
    `${supabaseUrl}/rest/v1/learning_units?slug=eq.station-7.2-the-angry-father&select=id,slug,title,source_key`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  const units = await unitRes.json();
  if (!units || units.length === 0) {
    console.error("Learning unit 'station-7.2-the-angry-father' not found in database!");
    process.exit(1);
  }

  const unit = units[0];
  console.log(`Found learning unit: ID=${unit.id}, Title="${unit.title}", SourceKey="${unit.source_key}"`);

  // 2. Find content block for this unit
  const blocksRes = await fetch(
    `${supabaseUrl}/rest/v1/content_blocks?unit_id=eq.${unit.id}&select=id,source_key,block_type`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  const blocks = await blocksRes.json();
  console.log(`Found ${blocks.length} content block(s) for unit.`);

  let blockId;
  if (blocks.length > 0) {
    blockId = blocks[0].id;
    console.log(`Updating existing content block ID=${blockId}...`);
    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/content_blocks?id=eq.${blockId}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          content: { html: cleanedHtml },
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      console.error("Failed to update content block:", err);
      process.exit(1);
    }
    const updated = await updateRes.json();
    console.log("Successfully updated content block:", updated[0]?.id);
  } else {
    console.log("Creating new content block...");
    const insertRes = await fetch(
      `${supabaseUrl}/rest/v1/content_blocks`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          unit_id: unit.id,
          source_key: "static-html",
          block_type: "legacy_static_html",
          sort_order: 0,
          content: { html: cleanedHtml },
        }),
      }
    );

    if (!insertRes.ok) {
      const err = await insertRes.text();
      console.error("Failed to insert content block:", err);
      process.exit(1);
    }
    const inserted = await insertRes.json();
    console.log("Successfully inserted content block:", inserted[0]?.id);
  }

  // 3. Verify
  const verifyRes = await fetch(
    `${supabaseUrl}/rest/v1/learning_units?slug=eq.station-7.2-the-angry-father&select=id,title,content_blocks(id,content)`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );
  const verifyData = await verifyRes.json();
  const savedHtml = verifyData[0]?.content_blocks?.[0]?.content?.html || "";
  console.log("Verification - DB HTML length:", savedHtml.length);
  console.log("Verification - First 150 chars:", savedHtml.slice(0, 150).replace(/\n/g, " "));
  console.log("Verification - Last 150 chars:", savedHtml.slice(-150).replace(/\n/g, " "));
  console.log("Done! Station 7.2 content successfully replaced in DB.");
}

runSeed().catch((err) => {
  console.error("Error running seed:", err);
  process.exit(1);
});
