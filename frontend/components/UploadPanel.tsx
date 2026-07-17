"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEMO_JOBS } from "../lib/demo-data";
import { SampleDownloadButton } from "./SampleDownloadButton";

export function UploadPanel() {
  const router = useRouter();
  const demoJob = DEMO_JOBS[0];
  const [message, setMessage] = useState("公开在线演示使用合成 PDF 和规则表，不需要上传真实文件。");

  function createDemo() {
    setMessage("已生成脱敏演示任务，正在打开任务详情。");
    window.setTimeout(() => router.push(`/jobs/${demoJob.job_id}`), 260);
  }

  return (
    <div className="glass-panel rounded-[28px] p-5">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <div className="text-sm font-bold text-muted">在线演示</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
            招聘方可直接体验的 AI 订单处理工作台
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{message}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button button-primary" onClick={createDemo} type="button">
            生成脱敏演示任务
          </button>
          <SampleDownloadButton job={demoJob} variant="secondary" />
        </div>
      </div>

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
            演示人工修正如何变成候选规则，并在确认后长期复用。
          </p>
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white/70 p-4 text-sm leading-6 text-muted">
        本地完整版支持 PDF / ZIP 上传、FastAPI 后端、Docker Compose 和真实 Excel 输出；公开 Demo 禁用真实上传，避免泄露客户数据和 API 密钥。
      </div>
    </div>
  );
}
