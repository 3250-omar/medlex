import test from "node:test";
import assert from "node:assert/strict";
import { resolveBlogFaqItems } from "../lib/blogs/faq.ts";

test("blog FAQs use the active locale and remain compatible with older rows", () => {
  const items = [
    { question_en: "English question", answer_en: "English answer", question_ar: "سؤال عربي", answer_ar: "إجابة عربية" },
    { question: "Legacy English | عربي قديم", answer: "Legacy answer | إجابة قديمة" },
    { question_en: "English only", answer_en: "English fallback", question_ar: null, answer_ar: null },
  ];
  assert.deepEqual(resolveBlogFaqItems(items, "en"), [
    { question: "English question", answer: "English answer" },
    { question: "Legacy English", answer: "Legacy answer" },
    { question: "English only", answer: "English fallback" },
  ]);
  assert.deepEqual(resolveBlogFaqItems(items, "ar"), [
    { question: "سؤال عربي", answer: "إجابة عربية" },
    { question: "عربي قديم", answer: "إجابة قديمة" },
    { question: "English only", answer: "English fallback" },
  ]);
});
