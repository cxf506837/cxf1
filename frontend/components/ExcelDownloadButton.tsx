"use client";

import { useEffect, useState } from "react";
import { USE_REMOTE_API } from "../lib/api";
import { downloadRemoteExcel } from "../lib/live-api";
import type { JobSummary } from "../lib/types";
import { SampleDownloadButton } from "./SampleDownloadButton";

export function ExcelDownloadButton({ job }: { job: JobSummary }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPassword(window.sessionStorage.getItem("orderops-demo-password") || "");
  }, []);

  if (!USE_REMOTE_API) {
    return <SampleDownloadButton job={job} />;
  }

  async function download() {
    setBusy(true);
    setStatus("正在下载真实 Excel...");
    try {
      const fileName = await downloadRemoteExcel(job, password);
      setStatus(`已下载 ${fileName}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "下载失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button className="button button-primary" disabled={busy} onClick={download} type="button">
        {busy ? "正在下载..." : "下载真实 Excel"}
      </button>
      <span className="text-xs text-muted">
        真实后端演示会下载 FastAPI 生成的 .xlsx；如已启用访问密码，会读取本页保存的访问密码。
      </span>
      {status && <span className="text-xs text-muted">{status}</span>}
    </div>
  );
}
