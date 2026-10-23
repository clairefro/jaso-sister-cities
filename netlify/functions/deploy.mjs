export default async req => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const { NETLIFY_BUILD_HOOK_URL } = process.env
  if (!NETLIFY_BUILD_HOOK_URL) {
    return new Response("Deploy is not configured", { status: 500 })
  }

  const res = await fetch(NETLIFY_BUILD_HOOK_URL, { method: "POST" })
  if (!res.ok) {
    return new Response("Failed to trigger build", { status: 502 })
  }
  return new Response("Deploy triggered", { status: 200 })
}
