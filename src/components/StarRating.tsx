import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  ratingCount?: number;
  size?: number;
}

export default function StarRating({ rating, ratingCount, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      {ratingCount !== undefined && (
        <span className="text-xs text-gray-500 mr-1">({ratingCount})</span>
      )}
    </div>
  );
}
