import React, { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, shortenAddress } from '@/lib/stacks';
import { BitcoinIcon, CoffeeCupIcon } from './icons/CoffeeIcons';

interface ConnectWalletProps {
  address: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  address,
  onConnect,
  onDisconnect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAvailable, setWalletAvailable] = useState(false);

  useEffect(() => {
    // Check if wallet is available
    const checkWallet = () => {
      const hasWallet = typeof window !== 'undefined' && (window as any).StacksProvider;
      setWalletAvailable(!!hasWallet);
    };
    
    checkWallet();
    window.addEventListener('load', checkWallet);
    return () => window.removeEventListener('load', checkWallet);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const connectedAddress = await connectWallet();
      if (connectedAddress) {
        onConnect(connectedAddress);
      } else {
        setError('No address returned from wallet');
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onDisconnect();
  };

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl border border-border">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-sm text-foreground font-medium">
            {shortenAddress(address)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleConnect}
        disabled={isLoading || !walletAvailable}
        className="group relative btn-warm flex items-center gap-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-warm"
      >
        <BitcoinIcon size={24} className="text-primary-foreground" />
        <span>
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </span>
        <CoffeeCupIcon size={28} className="text-primary-foreground" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-primary/30 blur-xl rounded-2xl group-hover:bg-primary/40 transition-all" />
      </button>
      
      <span className="text-xs text-muted-foreground">
        {walletAvailable ? 'Mobile QR Ready • Leather & Xverse Supported' : 'Install a Stacks wallet to connect'}
      </span>
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};

export default ConnectWallet;
