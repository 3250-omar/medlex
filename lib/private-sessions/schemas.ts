import { z } from "zod";

export const uuidSchema = z
  .string()
  .uuid({ message: "Invalid UUID identifier" });

export const cascCourseSlugSchema = z.literal("casc-academy");

export const currencySchema = z
  .string()
  .regex(/^[A-Z]{3}$/, {
    message: "Currency must be a 3-letter uppercase ISO code",
  });

export const idempotencyKeySchema = z
  .string()
  .min(16, { message: "Idempotency key must be at least 16 characters" })
  .max(128, { message: "Idempotency key must be at most 128 characters" });

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be formatted as YYYY-MM-DD",
  });

export const availabilityQuerySchema = z
  .object({
    courseSlug: cascCourseSlugSchema,
    from: dateStringSchema,
    to: dateStringSchema,
  })
  .refine((data) => data.from <= data.to, {
    message: "'from' date must be before or equal to 'to' date",
    path: ["from"],
  });

export const directCheckoutSchema = z.object({
  courseSlug: cascCourseSlugSchema,
  mode: z.literal("direct"),
  offerId: uuidSchema,
  slotId: uuidSchema,
});

export const packageCheckoutSchema = z.object({
  courseSlug: cascCourseSlugSchema,
  mode: z.literal("package"),
  offerId: uuidSchema,
});

export const checkoutRequestSchema = z.discriminatedUnion("mode", [
  directCheckoutSchema,
  packageCheckoutSchema,
]);

export const bookingRedemptionSchema = z.object({
  courseSlug: cascCourseSlugSchema,
  entitlementId: uuidSchema,
  slotId: uuidSchema,
});

export const purchaseParamSchema = z.object({
  purchaseId: uuidSchema,
});

export const sessionContextQuerySchema = z.object({
  courseSlug: cascCourseSlugSchema,
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type DirectCheckoutInput = z.infer<typeof directCheckoutSchema>;
export type PackageCheckoutInput = z.infer<typeof packageCheckoutSchema>;
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
export type BookingRedemptionInput = z.infer<typeof bookingRedemptionSchema>;
export type PurchaseParam = z.infer<typeof purchaseParamSchema>;
