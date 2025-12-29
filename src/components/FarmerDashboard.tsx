import React, { useEffect, useState } from 'react';
import { CoffeeItem, getFarmerEarnings, getFarmerItems, microToStx, shortenAddress } from '@/lib/stacks';
import { CoffeeBeanIcon, BitcoinIcon } from './icons/CoffeeIcons';
import { TrendingUp, Package } from 'lucide-react';

interface FarmerDashboardProps {
  address: string;
  refreshTrigger: number;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ address, refreshTrigger }) => {
  const [earnings, setEarnings] = useState<number>(0);
  const [items, setItems] = useState<CoffeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [earningsData, itemsData] = await Promise.all([
          getFarmerEarnings(address),
          getFarmerItems(address),
        ]);
        setEarnings(earningsData);
        setItems(itemsData);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [address, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="card-coffee p-6">
        <div className="flex items-center justify-center py-8">
          <CoffeeBeanIcon size={32} className="text-primary animate-bounce" />
        </div>
      </div>
    );
  }

  const activeItems = items.filter(item => item.active && item.quantity > 0);
  const totalListedBags = activeItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card-coffee p-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 flex items-center justify-center bg-gradient-warm rounded-xl">
          <TrendingUp size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">My Farm Dashboard</h3>
          <p className="text-sm text-muted-foreground font-mono">{shortenAddress(address)}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total earnings */}
        <div className="bg-muted/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BitcoinIcon size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {microToStx(earnings).toFixed(4)} <span className="text-lg text-primary">STX</span>
          </p>
        </div>

        {/* Active listings */}
        <div className="bg-muted/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={18} className="text-coffee-light" />
            <span className="text-sm text-muted-foreground">Active Listings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {activeItems.length} <span className="text-lg text-muted-foreground">coffees</span>
          </p>
          <p className="text-sm text-muted-foreground">{totalListedBags} bags total</p>
        </div>
      </div>

      {/* Active items list */}
      {activeItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Your Listings</h4>
          <div className="space-y-2">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <CoffeeBeanIcon size={20} className="text-coffee-light" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} bags left</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {microToStx(item.price).toFixed(2)} STX
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeItems.length === 0 && (
        <div className="text-center py-6">
          <CoffeeBeanIcon size={40} className="text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No active listings yet. List your coffee to start earning!
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
