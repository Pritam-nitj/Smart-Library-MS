'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Book, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  imageUrl?: string
  available: number
  quantity: number
}

export function BookSearch() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/books?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBooks()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [fetchBooks])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search books by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-muted-foreground/40"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <Card 
            key={book.id} 
            className="group hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm border-muted-foreground/10 hover:border-primary/20 hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden animate-fade-in-up"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {book.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                by {book.author}
              </CardDescription>
            </CardHeader>
            
            {book.imageUrl && (
              <div className="px-6 pb-4 relative z-10">
                <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-500">
                  <Image
                    src={book.imageUrl}
                    alt={`${book.title} cover`}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )}
            
            <CardContent className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Book className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    ISBN: {book.isbn}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="secondary" 
                    className="break-words whitespace-normal max-w-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 group-hover:scale-105"
                  >
                    {book.category}
                  </Badge>
                  
                  {book.description && (
                    <Badge 
                      variant="secondary" 
                      className="break-words whitespace-normal max-w-full bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20 transition-all duration-300 group-hover:scale-105"
                    >
                      {book.description}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-muted-foreground/10">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    book.available > 0 
                      ? 'text-green-600 bg-green-100/50 group-hover:bg-green-100' 
                      : 'text-red-600 bg-red-100/50 group-hover:bg-red-100'
                  } transition-colors duration-300`}>
                    {book.available > 0 ? `${book.available} available` : 'Out of stock'}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    Total: {book.quantity}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-16 animate-fade-in">
          <div className="relative inline-block">
            <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg font-medium">No books found</p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Try adjusting your search terms or browse different categories
          </p>
        </div>
      )}

      {loading && books.length === 0 && (
        <div className="text-center py-16 animate-pulse">
          <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Searching books...</p>
        </div>
      )}
    </div>
  )
}
