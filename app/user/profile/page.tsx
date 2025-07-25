'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Mail, Phone, MapPin, CreditCard, IdCard, Camera } from 'lucide-react'
import { ShimmerPostItem } from "react-shimmer-effects";
import {useRouter} from 'next/navigation'
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
  imageUrl?: string // Add this if you want profile pic URL
}

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

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
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        fetchUser()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = () => {
    toast.info("Profile image upload not implemented yet!")
  }

  const HandleFinePayment = async () => {
    const data = {
      MUID: 'MUID' + Date.now(),
      transactionId: 'T' + Date.now()
    }
    try{
      await axios.post('/api/payment/fine',data)
      .then((res) => {
          if(res.data && res.data.data.instrumentResponse.redirectInfo.url){
          router.push(res.data.data.instrumentResponse.redirectInfo.url)
        }
      })
    } catch(error) {
      console.log("Error in payment: ",error)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShimmerPostItem card title text cta />
        <ShimmerPostItem card title text cta />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings</p>
          </div>

          <div className="flex flex-col items-center mt-6 md:mt-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleImageUpload}
            >
              <Camera className="h-4 w-4 mr-2" /> Upload New
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        value={user.email}
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="pl-10"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="bg-zinc-800 text-white" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.studentId && (
                  <div className="flex items-center gap-3">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-sm text-gray-600">{user.studentId}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Outstanding Fine</p>
                    <p className={`text-sm ${user.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{user.fine.toFixed(2)}
                    </p>
                  </div>
                </div>

                {user.fine > 0 && (
                  <Button variant="outline" className="w-full" onClick={HandleFinePayment}>
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
