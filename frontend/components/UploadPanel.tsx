"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_JOBS } from "../lib/demo-data";
import { USE_REMOTE_API } from "../lib/api";
import { createRemoteDemoJob, uploadRemoteOrderFile } from "../lib/live-api";
import { SampleDownloadButton } from "./SampleDownloadButton";

export function UploadPanel() {
  const router = useRouter();
  const demoJob = DEMO_JOBS[0];
  const [message, setMessage] = useState(
    USE_REMOTE_API
      ? "真实后端演示已启用：可以运行脱敏样例，也可以上传 PDF 或 ZIP 生成真实 Excel。"
      : "公开在线演示使用合成 PDF 和规则表，不需要上传真实文件。"
  );
  const [password, setPassword] = useState("");
  const [jobName, setJobName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("orderops-demo-password");
    if (saved) setPassword(saved);
  }, []);

  function updatePassword(value: string) {
    setPassword(value);
    window.sessionStorage.setItem("orderops-demo-password", value);
  }

  async function createDemo() {
    if (!USE_REMOTE_API) {
      setMessage("已生成脱敏演示任务，正在打开任务详情。");
      window.setTimeout(() => router.push(`/jobs/${demoJob.job_id}`), 260);
      return;
    }
    setBusy(true);
    setMessage("正在调用 FastAPI 后端运行真实脱敏任务...");
    try {
      const job = await createRemoteDemoJob(password);
      setMessage(`真实后端任务已生成：${job.job_name}`);
      router.push(`/jobs/${job.job_id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "真实后端任务运行失败");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile() {
    if (!file) {
      setMessage("请先选择 PDF 或 ZIP 文件。");
      return;
    }
    setBusy(true);
    setMessage(`正在上传 ${file.name} 并调用真实后端处理...`);
    try {
      const result = await uploadRemoteOrderFile(file, { password, jobName });
      if ("jobs" in result) {
        const first = result.jobs[0];
        setMessage(`ZIP 批量处理完成：${result.batch_count} 个任务。正在打开第一份结果。`);
        if (first) router.push(`/jobs/${first.job_id}`);
      } else {
        setMessage(`任务已生成：${result.job_name}`);
        router.push(`/jobs/${result.job_id}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "文件处理失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel rounded-[28px] p-5">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <div className="text-sm font-bold text-muted">
            {USE_REMOTE_API ? "真实后端演示" : "在线演示"}
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
            招聘方可直接体验的 AI 订单处理工作台
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{message}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button button-primary" disabled={busy} onClick={createDemo} type="button">
            {busy ? "处理中..." : USE_REMOTE_API ? "运行真实脱敏任务" : "生成脱敏演示任务"}
          </button>
          <SampleDownloadButton job={demoJob} variant="secondary" />
        </div>
      </div>

      {USE_REMOTE_API && (
        <div className="mt-5 grid gap-3 rounded-3xl border border-line bg-white/70 p-4 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-end">
          <label className="grid gap-1 text-sm font-semibold text-ink">
            访问密码
            <input
              className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-normal outline-none focus:border-ink"
              onChange={(event) => updatePassword(event.target.value)}
              placeholder="面试展示密码"
              type="password"
              value={password}
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-ink">
            输出名称
            <input
              className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-normal outline-none focus:border-ink"
              onChange={(event) => setJobName(event.target.value)}
              placeholder="可选，默认按文件名"
              value={jobName}
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-ink">
            PDF 或 ZIP
            <input
              accept=".pdf,.zip,application/pdf,application/zip"
              className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-normal outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-ink file:px-3 file:py-1 file:text-white"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <button className="button" disabled={busy} onClick={uploadFile} type="button">
            上传并处理
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <Link className="soft-card rounded-3xl p-4" href={`/jobs/${demoJob.job_id}`}>
          <div className="text-sm font-bold text-ink">任务详情</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            查看订单行、字段溯源、人工审核项、候选规则和导出预览。
          </p>
        </Link>
        <Link className="soft-card rounded-3xl p-4" href="/quality">
          <div className="text-sm font-bold text-ink">质量看板</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            查看自动放行率、人工审核数、规则命中和字段异常趋势。
          </p>
        </Link>
        <Link className="soft-card rounded-3xl p-4" href="/rules">
          <div className="text-sm font-bold text-ink">规则沉淀</div>
          <p className="mt-2 text-sm leading-6 text-muted">
            展示人工修正如何变成候选规则，并在确认后长期复用。
          </p>
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white/70 p-4 text-sm leading-6 text-muted">
        本地真实演示支持 PDF / ZIP 上传、FastAPI 后端和真实 Excel 输出；公开静态 Demo 禁用真实上传，
        避免暴露客户数据和 API 密钥。用你电脑做服务器时，请保持电脑不睡眠，并只把访问密码发给面试官。
      </div>
    </div>
  );
}
