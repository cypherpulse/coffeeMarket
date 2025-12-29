import React from 'react';
import { CoffeeItem } from '@/lib/stacks';
import CoffeeCard from './CoffeeCard';
import { CoffeeBeanIcon } from './icons/CoffeeIcons';

interface CoffeeGridProps {
  items: CoffeeItem[];
  isLoading: boolean;
  onBuy: (item: CoffeeItem) => void;
}

const CoffeeGrid: React.FC<CoffeeGridProps> = ({ items, isLoading, onBuy }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <CoffeeBeanIcon size={48} className="text-primary animate-bounce" />
          <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading fresh coffee...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-4">
          <CoffeeBeanIcon size={64} className="text-muted-foreground/50" />
        </div>
        <h3 className="font-serif text-2xl text-foreground mb-2">No Coffee Listed Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Be the first farmer to list your premium coffee beans and start earning STX!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <CoffeeCard
          key={item.id}
          item={item}
          onBuy={onBuy}
          animationDelay={index}
        />
      ))}
    </div>
  );
};

export default CoffeeGrid;
