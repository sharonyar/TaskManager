import type { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <main>
      <header>
        <h1>Task Manager</h1>
      </header>
      {children}
    </main>
  )
}

export default Layout
