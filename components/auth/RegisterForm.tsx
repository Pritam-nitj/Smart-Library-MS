'use client'

import Link from 'next/link'
import React, { useState, useTransition, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
}
const ButtonComponent = ({ children, className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={`rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 ${className}`}
  >
    {children}
  </button>
)
export const Button = React.memo(ButtonComponent)

type InputProps = React.InputHTMLAttributes<HTMLInputElement>
const InputComponent = (props: InputProps) => (
  <input {...props} className={`w-full rounded-lg px-4 py-3 border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition ${props.className}`} />
)
export const Input = React.memo(InputComponent)

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  children?: React.ReactNode
}
const LabelComponent = ({ children, className, ...props }: LabelProps) => (
  <label {...props} className={`font-medium text-foreground ${className}`}>{children}</label>
)
export const Label = React.memo(LabelComponent)

type SelectProps = {
  value: string
  onValueChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}
const SelectComponent = ({ value, onValueChange, options, className }: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`w-full rounded-lg px-4 py-3 border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-ring transition ${className}`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)
export const Select = React.memo(SelectComponent)

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }, [])

  const onRoleChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to register')
      const data = await res.json()
      startTransition(() => {
        router.push(data.user.role === 'USER' ? '/user/dashboard' : '/librarian/dashboard')
      })
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-card border border-border rounded-3xl p-10 shadow-lg space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground mb-1">Create Your Account</h2>
          <p className="text-sm text-muted-foreground">Join LibraryMS to manage your books smartly.</p>
        </div>

        <div className="space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required autoComplete="name" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required autoComplete="email" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={onRoleChange}
              options={useMemo(
                () => [
                  { value: 'USER', label: 'Student' },
                  { value: 'LIBRARIAN', label: 'Librarian' },
                ],
                []
              )}
            />
          </div>
        </div>

        {error && <p className="text-destructive text-sm text-center animate-pulse">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? 'Creating Account…' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
