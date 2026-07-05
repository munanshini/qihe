import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function QiheLogo({ compact = false, className }: LogoProps) {
  const logoSize = compact ? 32 : 64;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.svg"
        alt="契合"
        width={logoSize}
        height={logoSize}
        className={cn("shrink-0", compact ? "rounded-xl" : "rounded-2xl")}
      />
      <div>
        <div
          className={cn(
            "font-bold leading-none text-slate-950",
            compact ? "text-lg" : "text-5xl",
          )}
        >
          契合
        </div>
        {compact ? (
          <div className="mt-0.5 text-[11px] text-slate-500">租房合同AI助手</div>
        ) : null}
      </div>
    </div>
  );
}
