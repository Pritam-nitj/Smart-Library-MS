import { ReactNode } from 'react'
import NavbarSection from '@/components/home/NavbarSection'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div>
      <NavbarSection />
      {children}
    </div>
  )
}
