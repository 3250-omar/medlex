import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { NextRequest, NextResponse } from "next/server.js";
import ts from "typescript";

const source = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");

function setup({ user = null, refresh = false, configured = true } = {}) {
  let authCalls = 0;
  const compiledModule = { exports: {} };
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports: compiledModule.exports, URL, Headers,
    process: { env: configured ? {
      NEXT_PUBLIC_SUPABASE_URL: "https://testproject.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-key",
    } : {} },
    require: (id) => {
      if (id === "next/server") return { NextResponse };
      if (id === "@supabase/ssr") return {
        createServerClient: (_url, _key, options) => ({
          auth: { getUser: async () => {
            authCalls++;
            if (refresh) options.cookies.setAll([{
              name: "sb-testproject-auth-token", value: "refreshed", options: { path: "/" },
            }]);
            return { data: { user } };
          } },
        }),
      };
      throw new Error(`Unexpected import: ${id}`);
    },
  });
  return {
    request: (path, cookie = "") => compiledModule.exports.proxy(new NextRequest(
      `https://www.medlexsolutions.com${path}`,
      { headers: { cookie, "x-vercel-ip-country": "gb" } },
    )),
    calls: () => authCalls,
  };
}

test("anonymous public pages skip Auth and retain locale/country headers", async () => {
  const app = setup();
  for (const path of ["/en", "/ar", "/en/blogs/example", "/ar/academy/preview/demo"]) {
    const response = await app.request(path, "analytics=yes; sb-other-auth-token=value; sb-testproject-auth-token-code-verifier=value");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-middleware-request-x-next-intl-locale"), path.split("/")[1]);
    assert.equal(response.headers.get("x-middleware-request-x-user-country"), "GB");
  }
  assert.equal(app.calls(), 0);
});

test("public pages with normal or chunked sessions still verify and refresh", async () => {
  const app = setup({ user: { id: "learner" }, refresh: true });
  for (const name of ["sb-testproject-auth-token", "sb-testproject-auth-token.0", "sb-testproject-auth-token.1"]) {
    const response = await app.request("/en", `${name}=existing`);
    assert.equal(response.cookies.get("sb-testproject-auth-token").value, "refreshed");
  }
  assert.equal(app.calls(), 3);
});

test("protected pages always verify, including missing or forged cookies", async () => {
  const app = setup();
  for (const path of ["/en/profile", "/ar/courses", "/en/academy/courses/example/learn/unit"]) {
    for (const cookie of ["", "sb-testproject-auth-token=forged"]) {
      const response = await app.request(path, cookie);
      const location = new URL(response.headers.get("location"));
      assert.equal(location.pathname, `/${path.split("/")[1]}/auth`);
      assert.equal(location.searchParams.get("redirect"), path);
    }
  }
  assert.equal(app.calls(), 6);
});

test("authenticated protected pages keep noindex", async () => {
  const app = setup({ user: { id: "learner" } });
  const response = await app.request("/en/profile", "sb-testproject-auth-token=existing");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  assert.equal(app.calls(), 1);
});

test("assets, locale redirects, and missing configuration keep existing behavior", async () => {
  const app = setup();
  assert.equal((await app.request("/api/auth/me")).status, 200);
  assert.equal((await app.request("/images/logo.png")).status, 200);
  assert.equal((await app.request("/")).headers.get("location"), "https://www.medlexsolutions.com/en/");
  assert.equal(app.calls(), 0);
  const unconfigured = setup({ configured: false });
  assert.equal((await unconfigured.request("/en")).status, 200);
  assert.equal((await unconfigured.request("/en/profile")).status, 307);
  assert.equal(unconfigured.calls(), 0);
});
