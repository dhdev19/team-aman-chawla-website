import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  image?: string;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <Card variant="outlined" className={cn("h-full", className)}>
      <div className="flex flex-col h-full">
        {/* Rating */}
        {testimonial.rating && (
          <div className="flex mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < testimonial.rating!
                    ? "text-yellow-400 fill-current"
                    : "text-neutral-300"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-neutral-700 mb-6 flex-1 italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold mr-3">
              {getInitials(testimonial.name)}
            </div>
          )}
          <div>
            <p className="font-semibold text-neutral-900">{testimonial.name}</p>
            {(testimonial.role || testimonial.company) && (
              <p className="text-sm text-neutral-600">
                {testimonial.role}
                {testimonial.role && testimonial.company && ", "}
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
