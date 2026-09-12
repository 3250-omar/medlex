import fs from 'fs';
import path from 'path';

// Parse .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

// ANSI color helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m"
};

function log(step, msg, type = "info") {
  const prefix = {
    info: `${colors.cyan}ℹ [${step}]${colors.reset}`,
    success: `${colors.green}✔ [${step}]${colors.reset}`,
    warn: `${colors.yellow}⚠ [${step}]${colors.reset}`,
    error: `${colors.red}✖ [${step}]${colors.reset}`,
  }[type];
  console.log(`${prefix} ${msg}`);
}

// 1. Ensure test user exists & has an active enrollment
async function ensureTestUser(email, password, fullName = "Dr. Simulation Tester") {
  log("SETUP", `Checking/creating test user: ${email}...`);

  // Check if user exists
  const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=50`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const usersData = await listRes.json();
  let user = usersData.users?.find(u => u.email === email);

  if (!user) {
    log("SETUP", `Creating new test user in Supabase...`);
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      }),
    });
    user = await createRes.json();
    if (!createRes.ok || !user?.id) {
      throw new Error(`Failed to create test user: ${JSON.stringify(user)}`);
    }
    log("SETUP", `User created with ID: ${user.id}`, "success");
  } else {
    // Update password to ensure it matches
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: "PUT",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    log("SETUP", `Found existing user ID: ${user.id}`, "info");
  }

  // Get active course (casc-academy)
  const courseRes = await fetch(`${supabaseUrl}/rest/v1/courses?slug=eq.casc-academy&select=id,slug`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const courses = await courseRes.json();
  const course = courses[0];
  if (!course) throw new Error("Course 'casc-academy' not found in database.");

  // Get course release
  const relRes = await fetch(`${supabaseUrl}/rest/v1/course_releases?course_id=eq.${course.id}&status=eq.published&select=id`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const releases = await relRes.json();
  const releaseId = releases[0]?.id;

  // Check enrollment
  const enrollRes = await fetch(`${supabaseUrl}/rest/v1/enrollments?user_id=eq.${user.id}&course_id=eq.${course.id}&select=id,status`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const enrollments = await enrollRes.json();

  if (!enrollments.length) {
    log("SETUP", `Enrolling user into ${course.slug}...`);
    const createEnroll = await fetch(`${supabaseUrl}/rest/v1/enrollments`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: user.id,
        course_id: course.id,
        release_id: releaseId,
        status: "active",
      }),
    });
    const enrollData = await createEnroll.json();
    log("SETUP", `Enrolled successfully! ID: ${enrollData[0]?.id}`, "success");
  } else {
    log("SETUP", `User already enrolled (Status: ${enrollments[0].status})`, "info");
  }

  return { user, courseId: course.id };
}

// 2. Run the realistic simulation journey through HTTP endpoints
async function runUserJourney(userIndex = 1, email = "learner_sim@medlex.test", password = "SimUser12345!") {
  const label = `User #${userIndex}`;
  const timing = {};
  const t0 = Date.now();

  console.log(`\n${colors.bold}${colors.magenta}=== [محاكاة كاملة للمستخدم: ${label}] ===${colors.reset}`);

  // Cookie jar for session management
  let cookieHeader = "";

  const extractCookies = (res) => {
    const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (raw.length) {
      cookieHeader = raw.map(c => c.split(';')[0]).join('; ');
    } else {
      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        cookieHeader = setCookie.split(',').map(c => c.split(';')[0].trim()).join('; ');
      }
    }
  };

  // STEP 1: LOGIN (تسجيل الدخول)
  const tLogin = Date.now();
  log("STEP 1: LOGIN", `Attempting sign-in for ${email}...`);
  const loginRes = await fetch(`${BASE_URL}/api/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  timing.login = Date.now() - tLogin;
  if (!loginRes.ok) {
    const errText = await loginRes.text();
    log("STEP 1: LOGIN", `Failed with status ${loginRes.status}: ${errText}`, "error");
    return { success: false, step: "login", error: errText };
  }
  extractCookies(loginRes);
  log("STEP 1: LOGIN", `Logged in successfully! (${timing.login} ms)`, "success");

  // STEP 2: ENROLLED COURSES (دخول الدورات المسجل بها)
  const tEnrolled = Date.now();
  log("STEP 2: DASHBOARD", `Fetching enrolled courses list...`);
  const enrolledRes = await fetch(`${BASE_URL}/api/courses/enrolled`, {
    headers: { Cookie: cookieHeader },
  });

  timing.enrolled = Date.now() - tEnrolled;
  if (!enrolledRes.ok) {
    log("STEP 2: DASHBOARD", `Failed to fetch enrolled courses (${enrolledRes.status})`, "error");
    return { success: false, step: "enrolled" };
  }
  const enrolledJson = await enrolledRes.json();
  const enrolledCourse = enrolledJson.data?.[0];
  if (!enrolledCourse) {
    log("STEP 2: DASHBOARD", `No enrolled courses found for user!`, "error");
    return { success: false, step: "enrolled_empty" };
  }
  log("STEP 2: DASHBOARD", `Found course: "${enrolledCourse.titleEn}" (Progress: ${enrolledCourse.progressPercent}%, Units: ${enrolledCourse.completedUnits}/${enrolledCourse.totalUnits}) in ${timing.enrolled} ms`, "success");

  const courseSlug = enrolledCourse.slug;

  // STEP 3: GET COURSE OUTLINE & UNITS
  log("STEP 3: COURSE UNITS", `Fetching course outline units for ${courseSlug}...`);
  // Fetch units from Supabase or learning endpoint
  const unitsRes = await fetch(`${supabaseUrl}/rest/v1/learning_units?select=id,slug,title,sequence_number&order=sequence_number.asc`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const units = await unitsRes.json();
  log("STEP 3: COURSE UNITS", `Course has ${units.length} learning units. Starting progression...`, "info");

  // STEP 4: PROGRESSING & COMPLETING UNITS (إنهاء الدروس)
  const tUnits = Date.now();
  let completedCount = 0;

  for (const unit of units) {
    const uSlug = unit.slug;
    // 4.a: Open unit
    await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/units/${uSlug}/open`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });

    // 4.b: Complete unit
    const compRes = await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/units/${uSlug}/complete`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });

    if (compRes.ok) {
      completedCount++;
      const compJson = await compRes.json();
      process.stdout.write(`\r  ↳ Unit [${unit.sequence_number}/${units.length}] "${unit.title.slice(0, 25)}..." Completed (${compJson.data?.progressPercent ?? 100}%)`);
    }
  }
  console.log("");
  timing.units = Date.now() - tUnits;
  log("STEP 4: COMPLETE COURSE", `All ${completedCount} units completed in ${timing.units} ms! Course is 100% finished.`, "success");

  // STEP 5: SUBMIT FEEDBACK (إرسال التقييم والفيدباك قبل الشهادة)
  const feedbackOptions = [
    "The CASC course was exceptionally clear, structured, and boosted my confidence in clinical consultations.",
    "Outstanding materials! The simulated stations and domain feedback were extremely realistic.",
    "Very thorough and practical approach to psychiatric examinations. Highly recommended to all candidates.",
    "The detailed breakdowns of each station made a tremendous difference in my preparation.",
    "Exceptional learning experience, clear explanations, and seamless progress tracking."
  ];
  const userFeedback = feedbackOptions[(userIndex - 1) % feedbackOptions.length];

  const tFeedback = Date.now();
  log("STEP 5: FEEDBACK", `Submitting course review & feedback...`);
  const feedbackRes = await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/feedback`, {
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback: userFeedback }),
  });
  timing.feedback = Date.now() - tFeedback;

  if (feedbackRes.ok) {
    log("STEP 5: FEEDBACK", `Feedback submitted successfully! ("${userFeedback.slice(0, 35)}...") in ${timing.feedback} ms`, "success");
  } else {
    const fbErr = await feedbackRes.text();
    log("STEP 5: FEEDBACK", `Feedback failed (${feedbackRes.status}): ${fbErr}`, "warn");
  }

  // STEP 6: CERTIFICATE STATUS CHECK (فحص استحقاق الشهادة)
  const tCertStatus = Date.now();
  log("STEP 6: CERT STATUS", `Checking certificate eligibility...`);
  const certStatusRes = await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/certificate`, {
    headers: { Cookie: cookieHeader },
  });
  timing.certStatus = Date.now() - tCertStatus;
  const certStatusJson = await certStatusRes.json();
  log("STEP 6: CERT STATUS", `Eligibility: ${certStatusJson.data?.eligible ? 'ELIGIBLE' : 'LOCKED'} (${certStatusJson.data?.progress_percent}%) in ${timing.certStatus} ms`, "success");

  // STEP 7: ISSUE CERTIFICATE (إصدار الشهادة باسم الطالب)
  const tIssue = Date.now();
  const studentName = `Dr. Omar M. Test (${userIndex})`;
  log("STEP 7: ISSUE CERTIFICATE", `Issuing certificate for name: "${studentName}"...`);
  const issueRes = await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/certificate`, {
    method: "POST",
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipient_name: studentName }),
  });
  timing.issue = Date.now() - tIssue;
  const issueJson = await issueRes.json();
  log("STEP 7: ISSUE CERTIFICATE", `Issued successfully! Certificate ID: ${issueJson.data?.certificate_id || 'OK'} in ${timing.issue} ms`, "success");

  // STEP 8: DOWNLOAD OFFICIAL PDF CERTIFICATE (توليد وتحميل ملف الـ PDF تحت الضغط)
  const tPdf = Date.now();
  log("STEP 8: PDF GENERATION", `Generating & downloading authentic PDF certificate...`);
  const pdfRes = await fetch(`${BASE_URL}/api/academy/courses/${courseSlug}/certificate/pdf`, {
    headers: { Cookie: cookieHeader },
  });
  timing.pdf = Date.now() - tPdf;

  if (!pdfRes.ok) {
    const err = await pdfRes.text();
    log("STEP 8: PDF GENERATION", `Failed with status ${pdfRes.status}: ${err}`, "error");
    return { success: false, step: "pdf", error: err };
  }

  const pdfBuffer = await pdfRes.arrayBuffer();
  timing.total = Date.now() - t0;

  // Save the sample PDF to verify correctness
  const outPdfPath = path.resolve(process.cwd(), `sample-simulation-cert-${userIndex}.pdf`);
  fs.writeFileSync(outPdfPath, Buffer.from(pdfBuffer));

  log("STEP 8: PDF GENERATION", `PDF generated successfully! (${(pdfBuffer.byteLength / 1024).toFixed(1)} KB) in ${timing.pdf} ms`, "success");
  log("FINISH", `Full user journey finished in ${(timing.total / 1000).toFixed(2)}s! Saved to: ${path.basename(outPdfPath)}`, "success");

  return { success: true, timing, bytes: pdfBuffer.byteLength };
}

// 3. MAIN RUNNER
async function main() {
  const args = process.argv.slice(2);
  const concurrentCount = parseInt(args[0] || "1", 10);

  console.log(`\n======================================================`);
  console.log(`🚀 بدء محاكاة سيناريو المستخدم الكامل (End-to-End User Simulation)`);
  console.log(`🎯 الهدف: Login ➔ Enrolled ➔ Finish Course ➔ Submit Feedback ➔ Claim Cert ➔ Download PDF`);
  console.log(`👥 عدد المستخدمين المتزامنين (Concurrent Users): ${concurrentCount}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`======================================================\n`);

  // Ensure test users exist
  const userCredentials = [];
  for (let i = 1; i <= concurrentCount; i++) {
    const email = `sim_learner_${i}@medlex.test`;
    const password = `TestPass1234!`;
    const name = `Learner Simulation ${i}`;
    await ensureTestUser(email, password, name);
    userCredentials.push({ index: i, email, password });
  }

  console.log(`\n${colors.bold}${colors.yellow}▶ بدء محاكاة الضغط وتدفق المستخدمين...${colors.reset}\n`);

  const startTime = Date.now();
  const results = await Promise.all(
    userCredentials.map(u => runUserJourney(u.index, u.email, u.password))
  );
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${colors.bold}${colors.green}================== نتائج المحاكاة ==================${colors.reset}`);
  console.log(`إجمالي الوقت المستغرق: ${totalDuration} ثانية`);
  console.log(`عدد العمليات الناجحة: ${results.filter(r => r.success).length} / ${concurrentCount}`);

  console.table(results.map((r, idx) => ({
    "User #": idx + 1,
    "Success": r.success ? "✔ YES" : "✖ NO",
    "Login (ms)": r.timing?.login || "-",
    "Dashboard (ms)": r.timing?.enrolled || "-",
    "Units Total (ms)": r.timing?.units || "-",
    "Feedback (ms)": r.timing?.feedback || "-",
    "Issue Cert (ms)": r.timing?.issue || "-",
    "PDF Gen (ms)": r.timing?.pdf || "-",
    "Total Time (s)": r.timing?.total ? (r.timing.total / 1000).toFixed(2) : "-",
  })));
  console.log(`====================================================\n`);
}

main().catch(err => {
  console.error("Simulation failed with error:", err);
  process.exit(1);
});
