import { theme } from "@/theme.config";

const HEIGHTS = {
  nav: 60,
  footer: 88,
  admin: 52,
  splash: 108,
} as const;

export default function BrandLogo({
  size = "nav",
  className,
}: {
  size?: keyof typeof HEIGHTS;
  className?: string;
}) {
  const height = HEIGHTS[size];
  return (
    <img
      src={theme.brand.logoInverse}
      alt={theme.brand.display}
      height={height}
      className={`brand-logo${className ? ` ${className}` : ""}`}
      style={{ height, width: height, objectFit: "contain", display: "block" }}
    />
  );
}
