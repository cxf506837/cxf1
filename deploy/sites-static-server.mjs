function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
}

async function tryAsset(request, env, pathname) {
  if (!env?.ASSETS?.fetch) return null;
  const response = await env.ASSETS.fetch(assetRequest(request, pathname));
  return response.status === 404 ? null : response;
}

function fallbackPaths(pathname) {
  if (pathname === "/") return ["/index.html"];
  if (pathname.includes(".")) return [pathname];
  return [pathname, `${pathname}.html`, "/_not-found.html"];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    for (const pathname of fallbackPaths(url.pathname)) {
      const response = await tryAsset(request, env, pathname);
      if (response) return response;
    }
    return new Response("Not found", { status: 404 });
  }
};
