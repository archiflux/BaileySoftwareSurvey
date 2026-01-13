import React from 'react';
import { Star } from 'lucide-react';
import type { Satisfaction } from '../../types/survey.types';

interface StarRatingProps {
  value: Satisfaction | null;
  onChange: (value: Satisfaction) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  label,
  error,
  required
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    onChange(rating as Satisfaction);
  };

  const handleMouseEnter = (rating: number) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue ?? value ?? 0;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-transform hover:scale-110"
            aria-label={`Rate ${rating} out of 5 stars`}
          >
            <Star
              size={32}
              className={`transition-colors ${
                rating <= displayValue
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'fill-none stroke-gray-300'
              }`}
            />
          </button>
        ))}
        {value && (
          <span className="ml-2 text-sm text-gray-600">
            {value} out of 5
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
