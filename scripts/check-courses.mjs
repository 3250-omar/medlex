import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
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

async function check() {
  const resUnits = await fetch(
    `${supabaseUrl}/rest/v1/learning_units?select=id,slug,title_en,sequence_number&order=sequence_number.asc`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  const units = await resUnits.json();
  console.log("Raw units response:", units);

  const resEnrollments = await fetch(
    `${supabaseUrl}/rest/v1/enrollments?select=id,user_id,course_id,status`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  const enrollments = await resEnrollments.json();
  console.log("Total Enrollments:", enrollments.length);
  console.log("Sample Enrollments:", enrollments.slice(0, 3));
}

check().catch(console.error);
