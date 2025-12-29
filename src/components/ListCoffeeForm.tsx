import React, { useState } from 'react';
import { listCoffee, stxToMicro } from '@/lib/stacks';
import { CoffeeBeanIcon } from './icons/CoffeeIcons';
import { Plus } from 'lucide-react';

interface ListCoffeeFormProps {
  onSuccess: () => void;
}

const ListCoffeeForm: React.FC<ListCoffeeFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !price || !quantity) {
      setError('Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);

    if (priceNum <= 0 || quantityNum <= 0) {
      setError('Price and quantity must be greater than 0');
      return;
    }

    if (name.length > 80) {
      setError('Coffee name must be 80 characters or less');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const priceInMicro = stxToMicro(priceNum);
      const success = await listCoffee(name, priceInMicro, quantityNum);
      
      if (success) {
        setName('');
        setPrice('');
        setQuantity('');
        setIsExpanded(false);
        onSuccess();
      }
    } catch (err) {
      console.error('Listing error:', err);
      setError('Failed to list coffee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full card-coffee p-6 flex items-center justify-center gap-3 group hover:border-primary/50 transition-all"
      >
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
          <Plus size={24} className="text-primary" />
        </div>
        <div className="text-left">
          <h3 className="font-serif text-lg font-semibold text-foreground">List Your Coffee</h3>
          <p className="text-sm text-muted-foreground">Start earning STX from your harvest</p>
        </div>
      </button>
    );
  }

  return (
    <div className="card-coffee p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-gradient-warm rounded-xl">
          <CoffeeBeanIcon size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">List New Coffee</h3>
          <p className="text-sm text-muted-foreground">Share your beans with the world</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coffee name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Coffee Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ethiopian Yirgacheffe"
            maxLength={80}
            className="w-full input-warm"
          />
          <p className="text-xs text-muted-foreground mt-1">{name.length}/80 characters</p>
        </div>

        {/* Price and quantity row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Price (STX)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full input-warm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity (bags)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full input-warm"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex-1 btn-coffee"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-warm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Listing...</span>
              </>
            ) : (
              <>
                <CoffeeBeanIcon size={18} />
                <span>List on CoffeeFarm</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListCoffeeForm;
