import type { JobSummary } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchJobs(): Promise<JobSummary[]> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs`, { next: { revalidate: 5 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.jobs || [];
  } catch {
    return [];
  }
}

export async function fetchJob(id: string): Promise<JobSummary | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/${id}`, { next: { revalidate: 2 } });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export function downloadUrl(id: string): string {
  return `${API_BASE}/api/jobs/${id}/download`;
}

