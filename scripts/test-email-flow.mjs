async function testEmailOtpFlow() {
  console.log("=== Testing MedLex Email OTP & Reset Password Flow ===");

  // Step 1: Send OTP
  console.log("\n1. Requesting OTP for phone: +201128543192, username: omar023");
  const sendRes = await fetch("http://localhost:3000/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: "+201128543192",
      emailOrUsername: "omar023",
    }),
  });

  const sendData = await sendRes.json();
  console.log("Send OTP Response:", JSON.stringify(sendData, null, 2));

  if (!sendRes.ok || !sendData.data?.success) {
    console.error("FAILED to send OTP:", sendData);
    process.exit(1);
  }

  const code = sendData.data.code;
  console.log(`\nGenerated OTP Code: [${code}] for [${sendData.data.email}]`);

  // Step 2: Reset Password using the generated OTP code
  const newPassword = "NewSecurePassword123!";
  console.log(`\n2. Resetting password using code: ${code}`);

  const resetRes = await fetch("http://localhost:3000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: "+201128543192",
      emailOrUsername: "omar023",
      code: code,
      newPassword: newPassword,
    }),
  });

  const resetData = await resetRes.json();
  console.log("Reset Password Response:", JSON.stringify(resetData, null, 2));

  if (!resetRes.ok || !resetData.data?.success) {
    console.error("FAILED to reset password:", resetData);
    process.exit(1);
  }

  console.log("\n=== SUCCESS: Entire Email OTP & Reset Password flow completed smoothly! ===");
}

testEmailOtpFlow().catch(console.error);
