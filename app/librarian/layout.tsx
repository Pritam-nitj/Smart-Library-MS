import { ReactNode } from 'react'
import NavbarSection from '@/components/home/NavbarSection'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <NavbarSection />
      {children}
    </div>
  )
}
