import React from 'react';
import { CoffeeItem, microToStx, shortenAddress } from '@/lib/stacks';
import { CoffeeBeanIcon } from './icons/CoffeeIcons';

interface CoffeeCardProps {
  item: CoffeeItem;
  onBuy: (item: CoffeeItem) => void;
  animationDelay?: number;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ item, onBuy, animationDelay = 0 }) => {
  return (
    <div
      className="card-coffee p-6 flex flex-col gap-4 opacity-0 animate-fade-up"
      style={{ animationDelay: `${animationDelay * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Coffee bag icon with steam */}
      <div className="relative flex justify-center">
        <div className="w-20 h-24 bg-gradient-to-b from-secondary to-coffee-bean rounded-t-xl rounded-b-3xl flex items-center justify-center relative overflow-hidden group">
          {/* Coffee bean pattern */}
          <div className="absolute inset-0 opacity-20">
            <CoffeeBeanIcon size={16} className="absolute top-2 left-2 rotate-12" />
            <CoffeeBeanIcon size={12} className="absolute top-4 right-3 -rotate-12" />
            <CoffeeBeanIcon size={14} className="absolute bottom-6 left-4 rotate-45" />
          </div>
          
          {/* Main bean icon */}
          <CoffeeBeanIcon size={36} className="text-cream/80 relative z-10" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
        
        {/* Steam effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-0.5 h-6 bg-steam/40 rounded-full animate-steam blur-[1px]" />
          <div className="w-0.5 h-8 bg-steam/30 rounded-full animate-steam-delay blur-[1px]" />
          <div className="w-0.5 h-5 bg-steam/40 rounded-full animate-steam-delay-2 blur-[1px]" />
        </div>
      </div>

      {/* Coffee name */}
      <h3 className="font-serif text-xl font-semibold text-foreground text-center leading-tight">
        {item.name}
      </h3>

      {/* Price */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-bold text-primary">
          {microToStx(item.price).toFixed(2)}
        </span>
        <span className="text-lg text-primary/80 font-medium">STX</span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">Available</span>
          <span className="font-medium text-foreground">{item.quantity} bags</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">Farmer</span>
          <span className="font-mono text-xs text-coffee-light">{shortenAddress(item.seller)}</span>
        </div>
      </div>

      {/* Buy button */}
      <button
        onClick={() => onBuy(item)}
        className="mt-auto btn-warm w-full flex items-center justify-center gap-2 group"
      >
        <CoffeeBeanIcon size={18} className="group-hover:animate-wiggle" />
        <span>Buy Now</span>
      </button>
    </div>
  );
};

export default CoffeeCard;
