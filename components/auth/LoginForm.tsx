'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Invalid credentials')

      const data = await res.json()
      startTransition(() => {
        router.push(data.user.role === 'USER' ? '/user/dashboard' : '/librarian/dashboard')
      })
    
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-card border border-border rounded-2xl p-12 shadow-xl space-y-8"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground">
            Log in to your LibraryMS account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-input text-foreground placeholder:text-muted-foreground border-border h-12"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-input text-foreground placeholder:text-muted-foreground border-border h-12"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all h-12 text-base"
          disabled={isPending}
        >
          {isPending ? 'Logging in…' : 'Log In'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-primary underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}
