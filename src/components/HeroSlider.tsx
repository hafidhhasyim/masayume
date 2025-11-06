"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string | null
  imageUrl: string
  image2Url: string | null
  buttonText: string | null
  buttonLink: string | null
  order: number
  isActive: boolean
}

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch("/api/sliders?is_active=true")
        const data = await res.json()
        setSlides(data)
      } catch (error) {
        console.error("Error fetching slides:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary to-primary/80 animate-pulse" />
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-primary to-primary/80 py-12 sm:py-16 lg:py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Wujudkan Mimpi Bekerja di Jepang
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl text-primary-foreground/90">
              LPK masayume.id adalah pusat pelatihan dan informasi terpercaya untuk program magang dan bekerja di Jepang
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image (imageUrl) with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: slide.imageUrl
                ? `url(${slide.imageUrl})`
                : "url(https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&q=80)",
            }}
          />
          
          {/* Red overlay */}
          <div className="absolute inset-0 bg-primary/70" />

          {/* Content Container */}
          <div className="relative z-10 flex h-full items-center">
            <div className="container mx-auto px-4">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8 items-center">
                {/* Left Side - Text Content */}
                <div className="text-primary-foreground animate-in fade-in slide-in-from-left-8 duration-700">
                  <h1 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-medium text-primary-foreground/90">
                    {slide.subtitle}
                  </h2>
                  {slide.description && (
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base text-primary-foreground/85 leading-relaxed">
                      {slide.description}
                    </p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    <Button asChild size="default" variant="secondary" className="text-sm px-4 sm:px-6">
                      <Link href={slide.buttonLink}>
                        {slide.buttonText}
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Right Side - Second Image (image2Url) */}
                {slide.image2Url && (
                  <div className="hidden lg:flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
                    <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-md h-[300px] lg:h-[400px]">
                      <div
                        className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${slide.image2Url})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-1.5 sm:p-2 text-white backdrop-blur transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-1.5 sm:p-2 text-white backdrop-blur transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-6 sm:w-8 bg-white"
                  : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}