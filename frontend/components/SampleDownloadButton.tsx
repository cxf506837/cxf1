"use client";

import { useState } from "react";
import { buildSampleCsv } from "../lib/api";
import type { JobSummary } from "../lib/types";

export function SampleDownloadButton({
  job,
  label = "下载样例 Excel（CSV）",
  variant = "primary"
}: {
  job: JobSummary;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const [status, setStatus] = useState("");

  function download() {
    const csv = `\uFEFF${buildSampleCsv(job)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = job.output_name;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(`已生成 ${job.output_name}`);
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        className={`button ${variant === "primary" ? "button-primary" : ""}`}
        onClick={download}
        type="button"
      >
        {label}
      </button>
      {status && <span className="text-xs text-muted">{status}</span>}
    </div>
  );
}
