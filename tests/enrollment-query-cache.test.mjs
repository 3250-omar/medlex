import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { QueryClient, QueryObserver } from "@tanstack/react-query";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL(
  "../app/[locale]/(marketing)/_apiCalls/academyQueries.ts", import.meta.url,
), "utf8");

test("user and enrollment observers share requests and refresh after progress changes", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const observers = [];
  const requests = [];
  let completedUnits = 0;
  const module = { exports: {} };
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports: module.exports,
    require: (id) => {
      if (id === "@tanstack/react-query") return {
        useQuery: (options) => {
          const observer = new QueryObserver(client, options);
          observers.push(observer);
          return observer;
        },
        useQueryClient: () => client,
        useMutation: (options) => options,
      };
      if (id === "@/lib/api/client") return {
        apiRequest: async (path) => {
          requests.push(path);
          return { id: "learner", enrolledCourses: [{ slug: "casc-academy", completedUnits }] };
        },
      };
      return require(id);
    },
  });
  const hooks = module.exports;
  const user = hooks.useCurrentUser();
  const courses = hooks.useEnrolledCourses(true);
  const unsubscribe = [user.subscribe(() => {}), courses.subscribe(() => {})];
  try {
    await client.ensureQueryData({ queryKey: hooks.academyQueryKeys.currentUser });
    assert.deepEqual(requests, ["/api/auth/me"]);
    assert.equal(courses.getCurrentResult().data[0].completedUnits, 0);

    completedUnits = 1;
    hooks.useCompleteUnit().onSuccess(null, { courseSlug: "casc-academy" });
    await client.ensureQueryData({ queryKey: hooks.academyQueryKeys.currentUser });
    // Wait for the invalidated active query to finish its refresh.
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(courses.getCurrentResult().data[0].completedUnits, 1);
    assert.deepEqual(requests, ["/api/auth/me", "/api/auth/me"]);

    client.setQueryData(hooks.academyQueryKeys.currentUser, null);
    assert.equal(courses.getCurrentResult().data.length, 0);
    assert.equal(requests.includes("/api/courses/enrolled"), false);
  } finally {
    unsubscribe.forEach((stop) => stop());
    observers.forEach((observer) => observer.destroy());
    client.clear();
  }
});
