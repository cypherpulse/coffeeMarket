export interface CoffeeItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  active: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
}

export interface AppState {
  wallet: WalletState;
  coffeeItems: CoffeeItem[];
  isLoading: boolean;
  error: string | null;
}
