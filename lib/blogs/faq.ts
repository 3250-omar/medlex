export type StoredBlogFaqItem =
  | {
      question_en: string;
      answer_en: string;
      question_ar?: string | null;
      answer_ar?: string | null;
    }
  | { question: string; answer: string };

export interface DisplayBlogFaqItem {
  question: string;
  answer: string;
}

function legacyTranslations(value: string): { en: string; ar: string | null } {
  const separator = value.indexOf("|");
  if (separator < 0) return { en: value.trim(), ar: null };
  return {
    en: value.slice(0, separator).trim(),
    ar: value.slice(separator + 1).trim() || null,
  };
}

export function resolveBlogFaqItems(
  items: StoredBlogFaqItem[] | null | undefined,
  locale: string,
): DisplayBlogFaqItem[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    let question: string;
    let answer: string;
    if ("question_en" in item) {
      if (typeof item.question_en !== "string" || typeof item.answer_en !== "string") return [];
      const hasArabic =
        typeof item.question_ar === "string" && item.question_ar.trim().length > 0 &&
        typeof item.answer_ar === "string" && item.answer_ar.trim().length > 0;
      question =
        locale === "ar" && hasArabic ? item.question_ar! : item.question_en;
      answer = locale === "ar" && hasArabic ? item.answer_ar! : item.answer_en;
    } else {
      if (typeof item.question !== "string" || typeof item.answer !== "string") return [];
      const hasTranslations = item.question.includes("|") && item.answer.includes("|");
      const legacyQuestion = hasTranslations ? legacyTranslations(item.question) : { en: item.question.trim(), ar: null };
      const legacyAnswer = hasTranslations ? legacyTranslations(item.answer) : { en: item.answer.trim(), ar: null };
      const hasArabic = Boolean(legacyQuestion.ar && legacyAnswer.ar);
      question =
        locale === "ar" && hasArabic ? legacyQuestion.ar! : legacyQuestion.en;
      answer =
        locale === "ar" && hasArabic ? legacyAnswer.ar! : legacyAnswer.en;
    }
    return question?.trim() && answer?.trim()
      ? [{ question: question.trim(), answer: answer.trim() }]
      : [];
  });
}
