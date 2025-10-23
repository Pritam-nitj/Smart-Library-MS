import HeroSection from '@/components/home/HeroSection'
import NavbarSection from '@/components/home/NavbarSection'
import FeatureSection from '@/components/home/FeatureSection'
import QuoteSection from '@/components/home/QuoteSection'
import FAQSection from '@/components/home/FAQSection'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      if (payload.role === 'USER') {
        redirect('/user/dashboard')
      } else {
        redirect('/librarian/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarSection/>
      <HeroSection/>
      <FeatureSection/>
      <QuoteSection/>
      <FAQSection/>
    </div>
  )
}
