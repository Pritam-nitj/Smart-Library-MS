'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRScanner } from '@/components/librarian/qr-scanner'
import { toast } from 'sonner'
import {Users, QrCode,BookOpen, FileText } from 'lucide-react'
import { parseQRData } from '@/lib/qr-utils'
import { useRouter } from 'next/navigation'

export default function LibrarianDashboard() {
    const router = useRouter()
  const [issueForm, setIssueForm] = useState({ studentId: '', bookId: '' })
  const [returnForm, setReturnForm] = useState({ bookId: '' })
  const [scanMode, setScanMode] = useState<'none' | 'issue' | 'return'>('none')
  const [quickIssueStep, setQuickIssueStep] = useState<'user' | 'book' | 'none'>('none')
  const [quickIssueData, setQuickIssueData] = useState({ userId: '', bookId: '' })

  const handleManualIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/books/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book issued successfully!')
        setIssueForm({ studentId: '', bookId: '' })
      } else {
        toast.error(data.error || 'Failed to issue book')
      }
    } catch (err) {
      console.error('Manual issue error:', err)
      toast.error('An error occurred while issuing book')
    }
  }

  const handleManualReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/books/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Book returned successfully! ${data.fine > 0 ? `Fine: $${data.fine}` : ''}`)
        setReturnForm({ bookId: '' })
      } else {
        toast.error(data.error || 'Failed to return book')
      }
    } catch (err) {
      console.error('Manual return error:', err)
      toast.error('An error occurred while returning book')
    }
  }

  const handleQRScan = (data: string) => {
    const parsed = parseQRData(data)
    
    if (!parsed) {
      toast.error('Invalid QR code format')
      return
    }

    if (scanMode === 'issue') {
      if (quickIssueStep === 'user' && parsed.type === 'user') {
        setQuickIssueData({ ...quickIssueData, userId: parsed.id })
        setQuickIssueStep('book')
        toast.success('User scanned, now scan book QR code')
      } else if (quickIssueStep === 'book' && parsed.type === 'book') {
        setQuickIssueData({ ...quickIssueData, bookId: parsed.id })
        performQuickIssue(quickIssueData.userId, parsed.id)
      } else {
        toast.error('Please scan the correct QR code type')
      }
    } else if (scanMode === 'return' && parsed.type === 'book') {
      performQuickReturn(parsed.id)
    }
  }

  const performQuickIssue = async (userId: string, bookId: string) => {
    try {
      // First get user's student ID
      const userResponse = await fetch(`/api/users`)
      const userData = await userResponse.json()
  const user = userData.users.find((u: { id: string }) => u.id === userId)
      
      if (!user) {
        toast.error('User not found')
        return
      }
      console.log(userId)
      console.log(bookId)
      const response = await fetch('/api/books/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.studentId, bookId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book issued successfully via QR!')
        resetQuickIssue()
      } else {
        toast.error(data.error || 'Failed to issue book')
      }
    } catch (err) {
      console.error('Quick issue error:', err)
      toast.error('An error occurred during quick issue')
    }
  }

  const performQuickReturn = async (bookId: string) => {
    try {
      const response = await fetch('/api/books/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Book returned successfully via QR! ${data.fine > 0 ? `Fine: $${data.fine}` : ''}`)
        setScanMode('none')
      } else {
        toast.error(data.error || 'Failed to return book')
      }
    } catch (err) {
      console.error('Quick return error:', err)
      toast.error('An error occurred during quick return')
    }
  }

  const resetQuickIssue = () => {
    setScanMode('none')
    setQuickIssueStep('none')
    setQuickIssueData({ userId: '', bookId: '' })
  }

  const startQuickIssue = () => {
    setScanMode('issue')
    setQuickIssueStep('user')
    setQuickIssueData({ userId: '', bookId: '' })
  }

  const startQuickReturn = () => {
    setScanMode('return')
    setQuickIssueStep('none')
  }

  return (
    <div className="min-h-screen bg-neutral-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900">Librarian Dashboard</h1>
          <p className="text-neutral-600 mt-2">Manage book issues, returns, and library operations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1  md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl justify-center items-center text-center shadow-sm p-6 flex flex-col gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <BookOpen className="text-indigo-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Manage Books</h3>
              <p className="text-sm text-neutral-600 mt-1">Add or remove books from library</p>
            </div>
            <Button onClick={() => router.push('/librarian/books')} 
              className="mt-auto bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
              View Books
            </Button>
          </div>

          <div className="bg-white justify-center items-center text-center rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users className="text-indigo-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Library Members</h3>
              <p className="text-sm text-neutral-600 mt-1">Manage member accounts</p>
            </div>
            <Button onClick={() => router.push('/librarian/members')}
              className="mt-auto  bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
              View Members
            </Button>
          </div>

          <div className="bg-white justify-center items-center text-center rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <FileText className="text-indigo-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Issue Reports</h3>
              <p className="text-sm text-neutral-600 mt-1">Track book circulation</p>
            </div>
            <Button onClick={() => router.push('/librarian/reports')}
              className="mt-auto  bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
              View Reports
            </Button>
          </div>

          <div className="bg-white justify-center items-center text-center rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <QrCode className="text-indigo-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">QR Generator</h3>
              <p className="text-sm text-neutral-600 mt-1">Create QR codes</p>
            </div>
            <Button onClick={() => router.push('/librarian/qr-generator')}
              className="mt-auto  bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
              Generate QR
            </Button>
          </div>
        </div>

        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-neutral-100 rounded-lg">
            <TabsTrigger 
              className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm" 
              value="qr">QR Code Operations</TabsTrigger>
            <TabsTrigger 
              className="rounded-md px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm" 
              value="manual">Manual Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Issue */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Issue Book</CardTitle>
                  <CardDescription>Issue a book to a student manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualIssue} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-neutral-900" htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={issueForm.studentId}
                        onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                        placeholder="Enter student ID"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-neutral-900" htmlFor="bookId">Book ID</Label>
                      <Input
                        id="bookId"
                        value={issueForm.bookId}
                        onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                        placeholder="Enter book ID"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full  bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
                      Issue Book
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Manual Return */}
              <Card className="bg-white rounded-xl shadow-sm border border-neutral-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Return Book</CardTitle>
                  <CardDescription>Process book return manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualReturn} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-neutral-900" htmlFor="returnBookId">Book ID</Label>
                      <Input
                        id="returnBookId"
                        value={returnForm.bookId}
                        onChange={(e) => setReturnForm({ bookId: e.target.value })}
                        placeholder="Enter book ID"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full  bg-indigo-400 hover:bg-indigo-500 text-white transition-colors">
                      Return Book
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            {scanMode === 'none' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white rounded-xl shadow-sm border border-neutral-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Quick Issue</CardTitle>
                    <CardDescription>Issue books using QR code scanner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={startQuickIssue} 
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Start Quick Issue
                    </Button>
                    <p className="text-sm text-neutral-600 mt-3">
                      First scan user QR, then scan book QR
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-xl shadow-sm border border-neutral-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">Quick Return</CardTitle>
                    <CardDescription>Return books using QR code scanner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={startQuickReturn} 
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Start Quick Return
                    </Button>
                    <p className="text-sm text-neutral-600 mt-3">
                      Scan book QR code to return
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex justify-center px-4">
                <div className="w-full max-w-md space-y-4">
                  <Card className="bg-white rounded-xl shadow-sm border border-neutral-100">
                    <CardContent className="p-6">
                      <QRScanner
                        onScan={handleQRScan}
                        title={
                          scanMode === 'issue'
                            ? quickIssueStep === 'user'
                              ? 'Scan User QR Code'
                              : 'Scan Book QR Code'
                            : 'Scan Book QR Code to Return'
                        }
                      />
                      <div className="flex justify-center mt-4">
                        <Button 
                          onClick={() => {
                            setScanMode('none')
                            resetQuickIssue()
                          }} 
                          variant="outline" 
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}