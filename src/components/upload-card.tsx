import { FileText, FileUp, Image, MoreHorizontal } from "lucide-react";
import type { RecentRecord } from "@/lib/types";

type UploadCardProps = {
  onClick: () => void;
};

export function UploadCard({ onClick }: UploadCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#2563EB] bg-blue-50/20 text-center"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-[#2563EB]">
        <FileUp size={22} />
      </span>
      <span className="mt-3 text-base font-semibold text-slate-800">上传合同</span>
      <span className="mt-1 text-xs text-slate-400">支持 word / pdf / 图片</span>
    </button>
  );
}

function getFileType(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "doc" || ext === "docx") return "word";
  if (ext === "pdf") return "pdf";
  if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "webp") return "image";
  return "file";
}

const fileIconMap = {
  word: { Icon: FileText, color: "#2563EB", bg: "bg-blue-50 border-[#2563EB]" },
  pdf: { Icon: FileText, color: "#DC2626", bg: "bg-red-50 border-[#DC2626]" },
  image: { Icon: Image, color: "#059669", bg: "bg-emerald-50 border-[#059669]" },
  file: { Icon: FileText, color: "#6B7280", bg: "bg-slate-50 border-[#6B7280]" },
};

export function RecentRecordList({ records }: { records: RecentRecord[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-800">最近记录</h2>
      <div className="space-y-3">
        {records.map((record) => {
          const fileType = getFileType(record.fileName);
          const { Icon, color, bg } = fileIconMap[fileType];
          return (
          <div key={record.fileName} className="flex items-center gap-3">
            <span
              className={`grid h-5 w-5 place-items-center rounded-sm border-2 ${bg}`}
            >
              <Icon size={12} strokeWidth={2.5} color={color} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-700">
                {record.fileName}
              </p>
              <p className="text-xs text-slate-400">
                {record.date} ·{" "}
                <span
                  className={
                    record.status === "审查完成"
                      ? "text-emerald-500"
                      : "text-orange-400"
                  }
                >
                  ● {record.status}
                </span>
              </p>
            </div>
            <button
              type="button"
              aria-label="更多"
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}
