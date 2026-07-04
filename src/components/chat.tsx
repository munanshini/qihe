"use client";

import { useRef, useState } from "react";
import { Copy, Check, Plus, Send, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { QiheLogo } from "@/components/brand";
import { cn } from "@/lib/utils";

/* 点赞弹跳动效 */
const likeBounceKeyframes = `
@keyframes like-bounce {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
`;

type PromptBoxProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  multiline?: boolean;
  className?: string;
  onFileUpload?: (file: File) => void;
};

export function PromptBox({
  placeholder,
  value,
  onChange,
  onSend,
  multiline = false,
  className,
  onFileUpload,
}: PromptBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload?.(file);
    }
    // 重置 input 以允许重复选择同一文件
    event.target.value = "";
  }

  function handleRemoveFile() {
    setSelectedFile(null);
  }

  return (
    <div
      className={cn(
        "rounded-[20px] border border-slate-200 bg-white shadow-sm",
        multiline ? "p-4" : "flex items-center gap-2 px-3 py-2",
        className,
      )}
    >
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-24 w-full resize-none bg-transparent text-base leading-7 text-slate-800 outline-none placeholder:text-slate-400"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend();
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      )}

      {/* 已选文件预览 */}
      {selectedFile && multiline && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <span className="min-w-0 truncate">{selectedFile.name}</span>
          <button
            type="button"
            onClick={handleRemoveFile}
            aria-label="移除文件"
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className={cn("flex items-center gap-2", multiline && "justify-end")}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          aria-label="添加附件"
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-950 text-slate-950"
          onClick={handleFileClick}
        >
          <Plus size={22} />
        </button>
        <button
          type="button"
          onClick={onSend}
          aria-label="发送"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#2563EB] text-white shadow-sm"
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          role === "user"
            ? "rounded-tr-md bg-[#2563EB] text-white"
            : "rounded-tl-md bg-slate-50 text-slate-700 ring-1 ring-slate-100",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 px-2 py-2 text-sm text-slate-600">
      <QiheLogo compact className="[&>div:last-child]:hidden" />
      <span>资料检索中...</span>
      <span className="flex gap-1">
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
      </span>
    </div>
  );
}

export function FeedbackActions({ content }: { content?: string }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleLike() {
    if (liked) {
      setLiked(false);
      return;
    }
    setLiked(true);
    setDisliked(false);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
  }

  function handleDislike() {
    if (disliked) {
      setDisliked(false);
      return;
    }
    setDisliked(true);
    setLiked(false);
  }

  async function handleCopy() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 兜底：创建临时 textarea
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      <style>{likeBounceKeyframes}</style>
      <div className="mt-3 flex items-center gap-4 text-slate-400">
        <button
          type="button"
          aria-label="点赞"
          onClick={handleLike}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full hover:bg-slate-50",
            animating && "animate-[like-bounce_0.5s_ease]",
            liked && "text-[#2563EB]",
          )}
        >
          <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          aria-label="点踩"
          onClick={handleDislike}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full hover:bg-slate-50",
            disliked && "text-slate-600",
          )}
        >
          <ThumbsDown size={18} fill={disliked ? "currentColor" : "none"} />
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="复制"
            onClick={handleCopy}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full hover:bg-slate-50",
              copied && "text-green-500",
            )}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          {copied && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[10px] text-white shadow">
              已复制
            </span>
          )}
        </div>
      </div>
    </>
  );
}
