"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export default function HeroSection(){
    const tags = [
      'Fiction', 'Non‑Fiction', 'Science', 'History', 'Programming', 'Biographies', 'Mathematics', 'Art', 'Comics', 'Novels', 'Poetry', 'Psychology', 'Economics', 'Philosophy', 'Technology', 'Databases', 'AI/ML', 'Networks'
    ];

    return(
      <section className={cn("min-h-screen flex justify-center items-center relative overflow-hidden")}>
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          )}
        />

        {/* Soft vignette */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

        {/* Animated library tags marquee (respects reduced motion) */}
        <div className="absolute left-1/2 top-[18%] z-0 w-[140vw] -translate-x-1/2 select-none opacity-40 md:opacity-50 [@media(prefers-reduced-motion:no-preference)]:animate-none">
          <div className="relative">
            <div className="marquee-row whitespace-nowrap will-change-transform [animation:marquee-linear_28s_linear_infinite]">
              {tags.map((t, i) => (
                <Badge key={`row1-${i}`} variant="secondary" className="mx-2 my-1 align-middle">
                  <BookOpen className="mr-1" /> {t}
                </Badge>
              ))}
              {tags.map((t, i) => (
                <Badge key={`row1b-${i}`} variant="secondary" className="mx-2 my-1 align-middle">
                  <BookOpen className="mr-1" /> {t}
                </Badge>
              ))}
            </div>
            <div className="marquee-row whitespace-nowrap will-change-transform [animation:marquee-linear-rev_34s_linear_infinite]">
              {tags.slice().reverse().map((t, i) => (
                <Badge key={`row2-${i}`} variant="outline" className="mx-2 my-1 align-middle">
                  <BookOpen className="mr-1" /> {t}
                </Badge>
              ))}
              {tags.slice().reverse().map((t, i) => (
                <Badge key={`row2b-${i}`} variant="outline" className="mx-2 my-1 align-middle">
                  <BookOpen className="mr-1" /> {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto px-6 py-16 flex flex-col justify-center items-center lg:gap-6 md:gap-8 gap-10 text-center">
          <div className="inline-block mb-2">
            <Badge variant="secondary" className="text-sm px-4 py-1.5 animate-pulse">
              📚 Trusted by 10,000+ readers worldwide
            </Badge>
          </div>
          
          <h1 className="mx-auto max-w-6xl text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            A Premier Digital Portal for{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Knowledge and Learning
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full"></span>
            </span>
          </h1>
          
          <p className="max-w-[90%] md:max-w-[80%] lg:max-w-[60%] mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground font-light">
            Discover a world of books, manage your reading journey, and explore endless possibilities with our modern
            library system. <span className="font-semibold text-foreground">Start your adventure today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Started Free
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold hover:bg-secondary transition-all duration-300">
                Explore Features
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-8 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background"></div>
              </div>
              <span className="font-medium">Join 10k+ readers</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border"></div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span className="ml-1 font-medium">4.9/5 rating</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee-linear {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-linear-rev {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
          .marquee-row { display: inline-block; padding: 6px 0; }
          :global([data-reduce-motion="true"]) .marquee-row { animation: none !important; }
          @media (prefers-reduced-motion: reduce) {
            .marquee-row { animation: none !important; }
          }
        `}</style>
      </section>
    )
}