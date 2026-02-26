import Link from "next/link";

interface TagProps {
  label: string;
  active?: boolean;
  asLink?: boolean;
}

export function Tag({ label, active = false, asLink = false }: TagProps) {
  const className = `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
    active
      ? "bg-accent-violet text-white"
      : "bg-accent-violet-light text-accent-violet hover:bg-accent-violet hover:text-white"
  }`;

  if (asLink) {
    return (
      <Link href={`/blog?tag=${encodeURIComponent(label)}`} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
