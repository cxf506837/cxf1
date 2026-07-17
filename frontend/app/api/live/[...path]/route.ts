const BACKEND_URL = process.env.ORDEROPS_BACKEND_URL || "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyToBackend(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const sourceUrl = new URL(request.url);
  const targetPath = path.join("/");
  const targetUrl = `${BACKEND_URL}/api/${targetPath}${sourceUrl.search}`;
  const headers = new Headers();

  for (const name of ["content-type", "x-demo-password"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  for (const name of ["content-type", "content-disposition"]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  return proxyToBackend(request, context);
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  return proxyToBackend(request, context);
}
