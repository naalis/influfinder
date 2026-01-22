"use client";

interface Category {
  id: string;
  label: string;
  emoji: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="hide-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-4">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isSelected
                ? "bg-brand-cyan text-black"
                : "border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
            }`}
          >
            <span className="mr-1.5">{category.emoji}</span>
            {category.label}
          </button>
        );
      })}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
