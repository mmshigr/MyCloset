import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ClosetProvider } from '@/components/closet-provider'
import { AuthGuard } from '@/components/auth-guard'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'CLOSET — クローゼット管理',
  description: '手持ちの服を一覧・管理し、着用履歴や購入・売却を記録できる個人用クローゼットアプリ',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f6f3',
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geist.variable} bg-background`}>
      <body className="antialiased">
       <AuthGuard>
         <ClosetProvider>{children}</ClosetProvider>
       </AuthGuard>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
