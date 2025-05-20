"use client"

import * as React from "react"
import { useState, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CarouselProps {
  children: ReactNode
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showIndicators?: boolean
  className?: string
  slideClassName?: string
}

export function Carousel({
  children,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showIndicators = true,
  className,
  slideClassName,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const slides = React.Children.toArray(children)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (autoPlay && !isHovering && slides.length > 1) {
      const timer = setTimeout(() => {
        nextSlide()
      }, interval)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, autoPlay, interval, isHovering, slides.length])

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn("min-w-full shrink-0 grow-0 flex items-center justify-center", slideClassName)}
            aria-hidden={index !== currentIndex}
          >
            {slide}
          </div>
        ))}
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-sm backdrop-blur-sm hover:opacity-100"
            onClick={prevSlide}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-sm backdrop-blur-sm hover:opacity-100"
            onClick={nextSlide}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 w-6 rounded-full bg-background/50 transition-all",
                index === currentIndex ? "bg-primary w-8" : "bg-background/50 hover:bg-background/80",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CarouselItemProps {
  children?: ReactNode
  className?: string
  imageUrl?: string
  imageAlt?: string
}

export function CarouselItem({ children, className, imageUrl, imageAlt = "Imagen de carrusel" }: CarouselItemProps) {
  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-center", className)}>
      {imageUrl && (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={imageAlt}
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
            <div className="text-white p-6 max-w-3xl text-center">{children}</div>
          </div>
        </div>
      )}
      {!imageUrl && children}
    </div>
  )
}

// Componentes adicionales para compatibilidad
export const CarouselContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex", className)}>{children}</div>
)

export const CarouselPrevious = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    className={cn(
      "absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-sm backdrop-blur-sm hover:opacity-100",
      className,
    )}
    onClick={onClick}
    aria-label="Anterior"
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
)

export const CarouselNext = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    className={cn(
      "absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 opacity-70 shadow-sm backdrop-blur-sm hover:opacity-100",
      className,
    )}
    onClick={onClick}
    aria-label="Siguiente"
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
)
