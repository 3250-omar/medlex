import { cn } from "@/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Centered max-width wrapper respecting the --content-max token.
 * Accepts `as` to render any HTML element while keeping container styles.
 */
export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-6 md:px-8 lg:px-12", className)}
      style={{ maxWidth: "var(--content-max)" }}
    >
      {children}
    </Tag>
  );
}
