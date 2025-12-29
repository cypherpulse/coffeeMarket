import React, { useState } from 'react';
import { CoffeeItem, microToStx, buyCoffee } from '@/lib/stacks';
import { CoffeeBeanIcon, BitcoinIcon } from './icons/CoffeeIcons';
import { X } from 'lucide-react';

interface BuyModalProps {
  item: CoffeeItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = microToStx(item.price * quantity);
  const maxQuantity = item.quantity;

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await buyCoffee(item.id, quantity);
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-card animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-warm rounded-2xl mb-4">
            <CoffeeBeanIcon size={32} className="text-primary-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Buy {item.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Support this coffee farmer with STX
          </p>
        </div>

        {/* Quantity selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Quantity (max: {maxQuantity})
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-12 h-12 flex items-center justify-center bg-muted rounded-xl text-foreground text-xl font-bold hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min={1}
              max={maxQuantity}
              className="flex-1 input-warm text-center text-xl font-semibold"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
              className="w-12 h-12 flex items-center justify-center bg-muted rounded-xl text-foreground text-xl font-bold hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Price per bag</span>
            <span className="text-foreground">{microToStx(item.price).toFixed(2)} STX</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Quantity</span>
            <span className="text-foreground">×{quantity}</span>
          </div>
          <div className="h-px bg-border my-3" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <div className="flex items-center gap-2">
              <BitcoinIcon size={20} className="text-primary" />
              <span className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} STX</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-coffee"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            disabled={isLoading}
            className="flex-1 btn-warm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CoffeeBeanIcon size={18} />
                <span>Confirm Purchase</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
