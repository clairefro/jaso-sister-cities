import React, { useState } from "react"

// Hidden: only rendered when the URL contains ?rebuild-sister-map.
export default function AdminDeploy() {
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  if (!new URLSearchParams(window.location.search).has("rebuild-sister-map"))
    return null

  const deploy = async () => {
    setBusy(true)
    setMessage("")
    try {
      const res = await fetch("/.netlify/functions/deploy", { method: "POST" })
      setMessage(res.ok ? "Deploy started" : `Failed (${res.status})`)
    } catch {
      setMessage("Request failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{ position: "absolute", bottom: 8, left: 8, zIndex: 10 }}
      className="admin-deploy"
    >
      <button onClick={deploy} disabled={busy}>
        {busy ? "Deploying..." : "Deploy"}
      </button>
      {message && <span style={{ marginLeft: 8 }}>{message}</span>}
    </div>
  )
}
