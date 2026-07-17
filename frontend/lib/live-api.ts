import type { JobSummary } from "./types";
import { CLIENT_API_BASE_URL, backendDownloadUrl, normalizeJob } from "./api";

export type UploadResult = JobSummary | { batch_count: number; jobs: JobSummary[] };

function passwordHeaders(password?: string): HeadersInit {
  return password ? { "X-Demo-Password": password } : {};
}

async function readError(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    return String(payload.detail || payload.message || response.statusText);
  } catch {
    return response.statusText || "请求失败";
  }
}

export async function createRemoteDemoJob(password?: string): Promise<JobSummary> {
  const response = await fetch(`${CLIENT_API_BASE_URL}/demo`, {
    method: "POST",
    headers: passwordHeaders(password)
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return normalizeJob(await response.json());
}

export async function uploadRemoteOrderFile(
  file: File,
  options: { password?: string; jobName?: string } = {}
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.jobName?.trim()) {
    formData.append("job_name", options.jobName.trim());
  }
  const response = await fetch(`${CLIENT_API_BASE_URL}/jobs`, {
    method: "POST",
    headers: passwordHeaders(options.password),
    body: formData
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const payload = await response.json();
  if (Array.isArray(payload.jobs)) {
    return {
      batch_count: Number(payload.batch_count || payload.jobs.length),
      jobs: payload.jobs.map(normalizeJob)
    };
  }
  return normalizeJob(payload);
}

export async function downloadRemoteExcel(job: JobSummary, password?: string): Promise<string> {
  const response = await fetch(backendDownloadUrl(job.job_id), {
    headers: passwordHeaders(password)
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = job.output_name.endsWith(".xlsx") ? job.output_name : `${job.job_name}_order_output.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
  return anchor.download;
}
