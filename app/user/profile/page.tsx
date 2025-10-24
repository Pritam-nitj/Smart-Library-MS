'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Mail, Phone, MapPin, CreditCard, IdCard, Camera } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const ShimmerPostItem = dynamic(
  () => import('react-shimmer-effects').then((mod) => mod.ShimmerPostItem),
  { ssr: false }
)
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  studentId?: string
  fine: number
  role: string
  profilePic?: string
}

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [, setUploaded] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        })
        setPreview(data.user.profilePic || null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...formData, profilePic: preview }
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Profile updated successfully ✨')
        fetchUser()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile ❌')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile ❗')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = () => {
    const input = document.getElementById('profilePicInput') as HTMLInputElement | null
    input?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Max 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    toast.info('Uploading image...')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      const imageUrl = data.secure_url
      setUploaded(imageUrl)
      toast.success('Image uploaded successfully 🌈')

      if (user?.id) {
        const updatePayload = { profilePic: imageUrl }
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        })
        if (res.ok) {
          toast.success('Profile picture updated 🎉')
          fetchUser()
        } else toast.error('Failed to update profile picture in DB')
      }
    } catch (err) {
      toast.error('Failed to upload image ❌')
    }
  }

  const HandleFinePayment = async () => {
    const data = { MUID: 'MUID' + Date.now(), transactionId: 'T' + Date.now() }
    try {
      const res = await axios.post('/api/payment/fine', data)
      if (res.data?.data?.instrumentResponse?.redirectInfo?.url)
        router.push(res.data.data.instrumentResponse.redirectInfo.url)
    } catch (error) {
      console.log('Error in payment: ', error)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ShimmerPostItem card title text cta />
        <ShimmerPostItem card title text cta />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-gray-200 transition-all hover:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-zinc-800 to-gray-500 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 mt-2">Manage your personal details & account settings</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 shadow-inner relative group transition-transform duration-300 hover:scale-105">
                {preview || user.profilePic ? (
                  <Image
                    src={preview || user.profilePic!}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-gray-400 to-gray-500 text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
                  <Camera className="text-white h-5 w-5" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 bg-white/80 hover:bg-gray-100 transition-all"
                onClick={handleImageUpload}
              >
                <Camera className="h-4 w-4 mr-2" /> Change Photo
              </Button>
              <input id="profilePicInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            {/* Left Section */}
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-md border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
                <CardDescription>Update your details below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 border-gray-300 focus:ring-zinc-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="email" value={user.email} className="pl-10 bg-gray-100" disabled />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-zinc-800 to-gray-600 hover:scale-[1.02] transition-transform text-white"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Right Section */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {user.studentId && (
                  <div className="flex items-center gap-3">
                    <IdCard className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Student ID</p>
                      <p className="text-sm text-gray-500">{user.studentId}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">Outstanding Fine</p>
                    <p
                      className={`text-sm font-semibold ${
                        user.fine > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      ₹{user.fine.toFixed(2)}
                    </p>
                  </div>
                </div>

                {user.fine > 0 && (
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all"
                    onClick={HandleFinePayment}
                  >
                    Pay Fine
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
