import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";

import ConnectWallet from './components/ConnectWallet';
import CoffeeGrid from './components/CoffeeGrid';
import BuyModal from './components/BuyModal';
import ListCoffeeForm from './components/ListCoffeeForm';
import FarmerDashboard from './components/FarmerDashboard';
import { BitcoinIcon, CoffeeBeanIcon, CoffeeCupIcon } from './components/icons/CoffeeIcons';
import { CoffeeItem, getAllCoffeeItems, checkWalletConnection } from './lib/stacks';

const REFRESH_INTERVAL = 15000; // 15 seconds

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [coffeeItems, setCoffeeItems] = useState<CoffeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CoffeeItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check wallet connection on mount
  useEffect(() => {
    const { isConnected, address: storedAddress } = checkWalletConnection();
    if (isConnected && storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  // Load coffee items
  const loadCoffeeItems = useCallback(async () => {
    try {
      const items = await getAllCoffeeItems();
      setCoffeeItems(items);
    } catch (error) {
      console.error('Failed to load coffee items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    loadCoffeeItems();

    const interval = setInterval(() => {
      loadCoffeeItems();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadCoffeeItems, refreshTrigger]);

  // Handle wallet connect
  const handleConnect = (connectedAddress: string) => {
    setAddress(connectedAddress);
    toast.success("Wallet connected!", {
      description: "Welcome to CoffeeFarm Market!",
    });
  };

  // Handle wallet disconnect
  const handleDisconnect = () => {
    setAddress(null);
    toast.info("Wallet disconnected");
  };

  // Handle buy click
  const handleBuyClick = (item: CoffeeItem) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    setSelectedItem(item);
  };

  // Handle purchase success
  const handlePurchaseSuccess = () => {
    toast.success("☕ Thank you for supporting coffee farmers!", {
      description: "Your purchase is being processed on-chain.",
    });
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle listing success
  const handleListingSuccess = () => {
    toast.success("🌱 Coffee listed successfully!", {
      description: "Your coffee is now available on the marketplace.",
    });
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      
      <div className="min-h-screen bg-gradient-coffee">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <BitcoinIcon size={40} className="text-primary" />
                  <div className="absolute -top-2 -right-1">
                    <CoffeeCupIcon size={24} className="text-coffee-light" />
                  </div>
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                    CoffeeFarm <span className="text-gradient">Market</span>
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Support Coffee Farmers with STX ☕🌱
                  </p>
                </div>
              </div>

              {/* Wallet */}
              <ConnectWallet
                address={address}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 opacity-10">
              <CoffeeBeanIcon size={120} className="text-primary animate-float" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-10">
              <CoffeeBeanIcon size={80} className="text-coffee-light animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute top-1/2 left-1/4 opacity-5">
              <BitcoinIcon size={200} className="text-primary" />
            </div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-up">
              <CoffeeBeanIcon size={18} className="text-primary" />
              <span className="text-sm text-primary font-medium">Powered by Bitcoin L2 (Stacks)</span>
              <BitcoinIcon size={18} className="text-primary" />
            </div>

            <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Fresh Coffee, <span className="text-gradient">Direct from Farmers</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Buy premium coffee beans directly from farmers around the world. 
              Pay with STX, support sustainable farming.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Stacks Testnet</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
                <CoffeeBeanIcon size={16} className="text-coffee-light" />
                <span className="text-sm text-muted-foreground">{coffeeItems.length} Coffees Listed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {address && (
                <>
                  <FarmerDashboard address={address} refreshTrigger={refreshTrigger} />
                  <ListCoffeeForm onSuccess={handleListingSuccess} />
                </>
              )}

              {!address && (
                <div className="card-coffee p-6 text-center">
                  <CoffeeCupIcon size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    Connect to Get Started
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your wallet to buy coffee or list your own beans for sale.
                  </p>
                  <ConnectWallet
                    address={address}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                </div>
              )}
            </div>

            {/* Marketplace Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  ☕ Marketplace
                </h2>
                <button
                  onClick={() => {
                    setIsLoading(true);
                    loadCoffeeItems();
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <CoffeeGrid
                items={coffeeItems}
                isLoading={isLoading}
                onBuy={handleBuyClick}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BitcoinIcon size={24} className="text-primary" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Built with ❤️ for coffee farmers</span>
                <CoffeeBeanIcon size={18} className="text-coffee-light" />
              </div>
            </div>
          </div>
        </footer>

        {/* Buy Modal */}
        {selectedItem && (
          <BuyModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            onSuccess={handlePurchaseSuccess}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

export default App;
