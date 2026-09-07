"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      // ユーザー名からAuthのメールアドレスを取得
      const { data: email, error: lookupError } = await supabase.rpc(
        "get_auth_email_by_username",
        {
          input_username: username,
        },
      )

      if (lookupError || !email) {
        console.error("Username lookup failed:", lookupError)
        setError(
          lookupError?.message ?? "ユーザー名が見つかりません"
        )
        return
      }

      // Supabase Authでログイン
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) {
            console.error("Supabase login failed:", loginError)
            setError(loginError.message)
            return
          }

      // ログイン成功
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Login failed:", error)
      setError("ログインに失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          CLOSET
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          クローゼット管理
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">
              ユーザー名
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
              placeholder="ユーザー名"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              パスワード
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
              placeholder="パスワード"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </main>
  )
}