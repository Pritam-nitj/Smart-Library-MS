"use client"

import { useState, useRef } from 'react'
import { Search, Clock, Book, ChevronLeft, ChevronRight, BookOpen, Newspaper, GraduationCap, FileText, Database, Baby, Sparkles, LucideIcon } from 'lucide-react'
import FeatureCard from '@/components/home/FeatureCard'
import { Badge } from '@/components/ui/badge'
      
interface Category {
  id: number;
  title: string;
  icon: LucideIcon;
  count: string;
  bgColor: string;
  image: string;
  filters: string[];
}

export default function FeatureSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false)
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true)

  const categories: Category[] = [
    {
      id: 1,
      title: 'FICTION BOOKS',
      icon: BookOpen,
      count: '2,450+ Books',
      bgColor: 'from-purple-500 to-purple-700',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
      filters: ['Romance', 'Mystery', 'Sci-Fi', 'Fantasy']
    },
    {
      id: 2,
      title: 'NON-FICTION BOOKS',
      icon: Book,
      count: '1,820+ Books',
      bgColor: 'from-blue-500 to-blue-700',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      filters: ['Biography', 'History', 'Self-Help', 'Business']
    },
    {
      id: 3,
      title: 'ACADEMIC RESOURCES',
      icon: GraduationCap,
      count: '3,200+ Resources',
      bgColor: 'from-green-500 to-green-700',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
      filters: ['Textbooks', 'Research Papers', 'Thesis', 'Journals']
    },
    {
      id: 4,
      title: 'MAGAZINES & JOURNALS',
      icon: Newspaper,
      count: '890+ Issues',
      bgColor: 'from-orange-500 to-orange-700',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
      filters: ['Science', 'Technology', 'Fashion', 'News']
    },
    {
      id: 5,
      title: 'REFERENCE MATERIALS',
      icon: FileText,
      count: '1,500+ References',
      bgColor: 'from-teal-500 to-teal-700',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop',
      filters: ['Dictionaries', 'Encyclopedias', 'Atlases', 'Manuals']
    },
    {
      id: 6,
      title: 'DIGITAL RESOURCES',
      icon: Database,
      count: '2,680+ E-Books',
      bgColor: 'from-indigo-500 to-indigo-700',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop',
      filters: ['E-Books', 'Audiobooks', 'Videos', 'Databases']
    },
    {
      id: 7,
      title: "CHILDREN'S SECTION",
      icon: Baby,
      count: '1,150+ Books',
      bgColor: 'from-pink-500 to-pink-700',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      filters: ['Picture Books', 'Early Readers', 'Middle Grade', 'Young Adult']
    },
    {
      id: 8,
      title: 'NEW ARRIVALS',
      icon: Sparkles,
      count: '245+ New Books',
      bgColor: 'from-red-500 to-red-700',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
      filters: ['This Week', 'This Month', 'Bestsellers', 'Pre-Orders']
    }
  ]

  const scroll = (direction: 'left' | 'right'): void => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 350
      const newScrollLeft = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = (): void => {
    const container = scrollContainerRef.current
    if (container) {
      setShowLeftArrow(container.scrollLeft > 10)
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      )
    }
  }

  return (
    <>
      {/* Original Feature Cards Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 mb-4">
              ✨ Core Features
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your library experience
            </p>
          </div>
          
          <div className="place-items-center grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            <FeatureCard
              icon={Search}
              title="Smart Search"
              description="Advanced search with filters and recommendations to find your next read instantly."
              image="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=400&h=300&fit=crop"
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Access"
              description="Manage your library account anytime, anywhere with our cloud-based system."
              image="https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop"
            />
            <FeatureCard
              icon={Book}
              title="Smart Tracking"
              description="Automated tracking system for books, dues, and fines with timely notifications."
              image="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* New Browse Categories Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-sm px-4 py-1.5 mb-4">
              📖 Discover
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Explore our diverse collection of <span className="font-semibold text-primary">50,000+</span> resources across multiple categories
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category: Category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.id} className="flex-shrink-0 w-80 group cursor-pointer">
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-85 group-hover:opacity-90 transition-opacity duration-500`} />
                      </div>

                      <div className="relative h-full flex flex-col justify-between p-6 text-white">
                        <div className="bg-white/25 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <IconComponent className="w-8 h-8" />
                        </div>

                        <div className="transform transition-all duration-500 group-hover:translate-y-0">
                          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{category.title}</h3>
                          <p className="text-white/95 text-sm font-semibold mb-4 drop-shadow-md">{category.count}</p>
                          <div className="flex flex-wrap gap-2">
                            {category.filters.map((filter: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs px-3 py-1.5 bg-white/25 backdrop-blur-md rounded-full hover:bg-white/35 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md"
                              >
                                {filter}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="mt-5 w-full flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-all duration-300 hover:gap-3 group/btn">
                      <span>Explore More Contents</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                )
              })}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </>
  )
}