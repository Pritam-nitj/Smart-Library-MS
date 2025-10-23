import {Quote} from 'lucide-react'

export default function QuoteSection(){
    return(
        <section className="relative flex justify-center items-center py-24 my-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Decorative quote marks */}
        <div className="absolute top-8 left-8 text-primary/20 text-9xl font-serif leading-none select-none hidden md:block">&quot;</div>
        <div className="absolute bottom-8 right-8 text-primary/20 text-9xl font-serif leading-none select-none hidden md:block rotate-180">&quot;</div>
        
        <div className="container relative mx-auto px-6 text-center max-w-5xl">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-border/50">
            <Quote className="text-primary sm:w-12 sm:h-12 w-8 h-8 mb-8 mx-auto drop-shadow-lg"/>
            
            <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic font-light mb-10 leading-relaxed text-foreground/90">
              A room without books is like a body without a soul.
            </blockquote>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <cite className="text-lg md:text-xl text-muted-foreground font-medium not-italic">
                Marcus Tullius Cicero
              </cite>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            </div>
          </div>
        </div>
      </section>
    )
}