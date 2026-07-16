"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function UploadPanel() {
  const [message, setMessage] = useState("可上传脱敏 PDF 或 ZIP，也可以先生成内置演示任务。");

  async function createDemo() {
    setMessage("正在生成脱敏演示任务...");
    const response = await fetch(`${API_BASE}/api/demo`, { method: "POST" });
    setMessage(response.ok ? "演示任务已生成，请刷新任务列表查看。" : "生成失败，请检查后端服务。");
  }

  async function submit(formData: FormData) {
    setMessage("正在上传并处理...");
    const response = await fetch(`${API_BASE}/api/jobs`, { method: "POST", body: formData });
    setMessage(response.ok ? "任务已创建，请刷新任务列表查看。" : "处理失败，请确认文件为脱敏 PDF 或 ZIP。");
  }

  return (
    <div className="glass-panel rounded-[28px] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="text-sm font-bold text-muted">任务入口</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">上传订单文件并生成可追溯 Excel</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{message}</p>
        </div>
        <button className="button" onClick={createDemo} type="button">
          生成脱敏演示任务
        </button>
      </div>
      <form action={submit} className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px_180px]">
        <input className="field" name="file" type="file" accept=".pdf,.zip" required />
        <input className="field" name="job_name" placeholder="输出名称，可选" />
        <button className="button button-primary" type="submit">
          开始处理
        </button>
      </form>
    </div>
  );
}

