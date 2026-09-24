import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  ratingCount?: number;
  size?: number;
}

export default function StarRating({ rating, ratingCount, size = 14 }: StarRatingProps) {
  // Integer rating fills whole stars; fractional values round down to the lower star
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < rating
                ? "fill-gray-900 text-gray-900 dark:fill-white dark:text-white"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }
          />
        ))}
      </div>
      {ratingCount !== undefined && (
        <span className="ms-1 text-xs text-gray-500">({ratingCount})</span>
      )}
    </div>
  );
}
