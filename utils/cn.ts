/**
 * Combine class names, filtering out falsy values.
 * A lightweight alternative to clsx for simple conditional classes.
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}
