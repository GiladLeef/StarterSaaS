import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating?: number
  avatar?: string
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
  avatar,
  className = ''
}: TestimonialCardProps) {
  return (
    <div className={cn(
      'border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300',
      className
    )}>
      {rating > 0 && (
        <div className="flex mb-4">
          {[...Array(rating)].map((_, i) => (
            <span key={i} className="text-yellow-500 text-xl">★</span>
          ))}
        </div>
      )}
      <p className="text-gray-700 mb-6 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        {avatar && (
          <img 
            src={avatar} 
            alt={author}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <div className="font-semibold text-black">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  )
}

interface TestimonialGridProps {
  testimonials: Array<{
    quote: string
    author: string
    role: string
    rating?: number
    avatar?: string
  }>
  columns?: 2 | 3
}

export function TestimonialGrid({ 
  testimonials, 
  columns = 3 
}: TestimonialGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3'
  }

  return (
    <div className={cn('grid gap-8', gridCols[columns])}>
      {testimonials.map((testimonial, idx) => (
        <TestimonialCard
          key={idx}
          quote={testimonial.quote}
          author={testimonial.author}
          role={testimonial.role}
          rating={testimonial.rating}
          avatar={testimonial.avatar}
        />
      ))}
    </div>
  )
}

