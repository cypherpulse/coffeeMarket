import { request, AddressPurpose } from 'sats-connect';
import { Cl, cvToValue, fetchCallReadOnlyFunction } from '@stacks/transactions';

// Contract configuration
export const CONTRACT_ADDRESS = 'STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y';
export const CONTRACT_NAME = 'coffee-farm-market';
export const NETWORK = 'testnet';

// Types
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

// Helper to convert microSTX to STX
export const microToStx = (microStx: number): number => {
  return microStx / 1_000_000;
};

// Helper to convert STX to microSTX
export const stxToMicro = (stx: number): number => {
  return Math.floor(stx * 1_000_000);
};

// Shorten principal address for display
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Storage key for wallet address
const WALLET_STORAGE_KEY = 'coffeefarm_wallet_address';

// Get stored wallet address
export const getStoredAddress = (): string | null => {
  return localStorage.getItem(WALLET_STORAGE_KEY);
};

// Store wallet address
export const storeAddress = (address: string): void => {
  localStorage.setItem(WALLET_STORAGE_KEY, address);
};

// Clear stored address
export const clearStoredAddress = (): void => {
  localStorage.removeItem(WALLET_STORAGE_KEY);
};

// Connect wallet
export const connectWallet = async (): Promise<string | null> => {
  try {
    const response = await request('getAddresses', {
      purposes: [AddressPurpose.Stacks],
    });
    
    if (response.status === 'success' && response.result.addresses.length > 0) {
      const stxAddress = response.result.addresses.find(
        (addr) => addr.purpose === AddressPurpose.Stacks
      );
      const address = stxAddress?.address || response.result.addresses[0]?.address;
      if (address) {
        storeAddress(address);
        return address;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = (): void => {
  clearStoredAddress();
};

// Check if wallet is connected
export const checkWalletConnection = (): WalletState => {
  const address = getStoredAddress();
  return {
    isConnected: !!address,
    address,
  };
};

// Get next item ID using fetch API
export const getNextItemId = async (): Promise<number> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network: 'testnet',
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-next-item-id',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    return Number(value);
  } catch (error) {
    console.error('Failed to get next item ID:', error);
    return 1;
  }
};

// Get a single coffee item by ID
export const getCoffeeItem = async (id: number): Promise<CoffeeItem | null> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network: 'testnet',
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-coffee-item',
      functionArgs: [Cl.uint(id)],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    
    if (value && typeof value === 'object') {
      const item = value as Record<string, unknown>;
      if (item.name) {
        return {
          id,
          name: item.name as string,
          price: Number(item.price),
          quantity: Number(item.quantity),
          seller: item.seller as string,
          active: item.active as boolean,
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`Failed to get coffee item ${id}:`, error);
    return null;
  }
};

// Get all coffee items
export const getAllCoffeeItems = async (): Promise<CoffeeItem[]> => {
  try {
    const nextId = await getNextItemId();
    const items: CoffeeItem[] = [];
    
    // Fetch all items from 1 to nextId - 1
    const promises = [];
    for (let i = 1; i < nextId; i++) {
      promises.push(getCoffeeItem(i));
    }
    
    const results = await Promise.all(promises);
    
    for (const item of results) {
      if (item && item.active && item.quantity > 0) {
        items.push(item);
      }
    }
    
    return items;
  } catch (error) {
    console.error('Failed to get all coffee items:', error);
    return [];
  }
};

// Get farmer earnings
export const getFarmerEarnings = async (farmerAddress: string): Promise<number> => {
  try {
    const result = await fetchCallReadOnlyFunction({
      network: 'testnet',
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-farmer-earnings',
      functionArgs: [Cl.principal(farmerAddress)],
      senderAddress: CONTRACT_ADDRESS,
    });
    
    const value = cvToValue(result);
    return Number(value);
  } catch (error) {
    console.error('Failed to get farmer earnings:', error);
    return 0;
  }
};

// Get farmer's coffee items
export const getFarmerItems = async (farmerAddress: string): Promise<CoffeeItem[]> => {
  try {
    const nextId = await getNextItemId();
    const items: CoffeeItem[] = [];
    
    for (let i = 1; i < nextId; i++) {
      const item = await getCoffeeItem(i);
      if (item && item.seller === farmerAddress) {
        items.push(item);
      }
    }
    
    return items;
  } catch (error) {
    console.error('Failed to get farmer items:', error);
    return [];
  }
};

// Serialize Clarity value to string for contract calls
const serializeClarityArg = (cv: ReturnType<typeof Cl.uint | typeof Cl.stringAscii>): string => {
  if ('value' in cv) {
    return String(cv.value);
  }
  return JSON.stringify(cv);
};

// List coffee (for farmers)
export const listCoffee = async (
  name: string,
  priceInMicroStx: number,
  quantity: number
): Promise<boolean> => {
  try {
    const response = await request('stx_callContract', {
      contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
      functionName: 'list-coffee',
      functionArgs: [
        serializeClarityArg(Cl.stringAscii(name)),
        serializeClarityArg(Cl.uint(priceInMicroStx)),
        serializeClarityArg(Cl.uint(quantity)),
      ],
    });
    
    return response.status === 'success';
  } catch (error) {
    console.error('Failed to list coffee:', error);
    throw error;
  }
};

// Buy coffee
export const buyCoffee = async (
  itemId: number,
  quantity: number
): Promise<boolean> => {
  try {
    const response = await request('stx_callContract', {
      contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
      functionName: 'buy-coffee',
      functionArgs: [
        serializeClarityArg(Cl.uint(itemId)),
        serializeClarityArg(Cl.uint(quantity)),
      ],
    });
    
    return response.status === 'success';
  } catch (error) {
    console.error('Failed to buy coffee:', error);
    throw error;
  }
};
