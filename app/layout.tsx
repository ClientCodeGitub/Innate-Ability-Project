import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Innate Ability',
  description: 'Unlock your innate ability',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
