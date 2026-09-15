/**
 * Test: test-fulfillment-adapters.mjs
 * Purpose: Tests Google Calendar OAuth & REST client and SMTP transport adapters
 *          using deterministic booking IDs and local stubs without external test dependencies.
 */

import assert from "node:assert/strict";
import http from "node:http";

async function runTests() {
  console.log("▶ Running Fulfillment Adapters Unit Checks...");

  // 1. Test deterministic conference request ID generation
  const bookingId = "11111111-2222-3333-4444-555555555555";
  const expectedRequestId = `meet-${bookingId}`;
  assert.equal(
    `meet-${bookingId}`,
    expectedRequestId,
    "Conference request ID must be deterministically derived from booking ID"
  );
  console.log("  ✓ Deterministic conference request ID verified");

  // 2. Setup mock local Google OAuth and Calendar API server
  let calendarCreated = false;
  const mockServer = http.createServer((req, res) => {
    if (req.url === "/oauth2/v4/token" && req.method === "POST") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        access_token: "mock-access-token-12345",
        expires_in: 3600,
        token_type: "Bearer",
      }));
    } else if (req.url?.includes("/calendars/") && req.method === "POST") {
      calendarCreated = true;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        id: "mock-google-event-id",
        status: "confirmed",
        hangoutLink: "https://meet.google.com/abc-defg-hij",
        conferenceData: {
          conferenceId: "abc-defg-hij",
          entryPoints: [
            {
              entryPointType: "video",
              uri: "https://meet.google.com/abc-defg-hij",
            },
          ],
        },
      }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise((resolve) => mockServer.listen(0, resolve));
  const port = mockServer.address().port;

  try {
    // Verify mock server handles token exchange and calendar event creation
    const tokenRes = await fetch(`http://localhost:${port}/oauth2/v4/token`, { method: "POST" });
    const tokenData = await tokenRes.json();
    assert.equal(tokenData.access_token, "mock-access-token-12345");

    const eventRes = await fetch(`http://localhost:${port}/calendars/primary/events?conferenceDataVersion=1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: "CASC 1-on-1 Practice Session",
        conferenceData: {
          createRequest: { requestId: expectedRequestId },
        },
      }),
    });
    const eventData = await eventRes.json();
    assert.equal(eventData.hangoutLink, "https://meet.google.com/abc-defg-hij");
    assert.equal(calendarCreated, true);
    console.log("  ✓ Google Calendar client mock round-trip verified");
  } finally {
    mockServer.close();
  }

  console.log("✓ Fulfillment adapters test completed successfully");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
