import type { ContractDraft } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** 将合同草案转为可复制的纯文本 */
export function draftToPlainText(draft: ContractDraft): string {
  const lines: string[] = [];
  lines.push(`${draft.label}`);
  lines.push(draft.title);
  lines.push("");
  for (const section of draft.sections) {
    lines.push(section.title);
    for (const line of section.body) {
      lines.push(line);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}
