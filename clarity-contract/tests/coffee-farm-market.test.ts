import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe('Coffee Farm Market Contract Tests', () => {

  it('should list coffee successfully', () => {
    const { result } = simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Arabica Beans'),
        Cl.uint(1000000), // 1 STX
        Cl.uint(10)
      ],
      address1
    );

    expect(result).toBeOk(Cl.uint(1)); // item-id 1

    // Check item details
    const item = simnet.callReadOnlyFn('coffee-farm-market', 'get-coffee-item', [Cl.uint(1)], address1);
    expect(item.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii('Arabica Beans'),
        price: Cl.uint(1000000),
        quantity: Cl.uint(10),
        seller: Cl.principal(address1),
        active: Cl.bool(true)
      })
    );

    // Check next item id
    const nextId = simnet.callReadOnlyFn('coffee-farm-market', 'get-next-item-id', [], address1);
    expect(nextId.result).toBeUint(2);
  });

  it('should buy coffee successfully', () => {
    // List item
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Robusta Beans'),
        Cl.uint(2000000),
        Cl.uint(5)
      ],
      address1
    );

    // Buy
    const { result } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(1), // item id 1
        Cl.uint(2)
      ],
      address2
    );

    expect(result).toBeOk(Cl.bool(true));

    // Check quantity reduced
    const item = simnet.callReadOnlyFn('coffee-farm-market', 'get-coffee-item', [Cl.uint(1)], address1);
    expect(item.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii('Robusta Beans'),
        price: Cl.uint(2000000),
        quantity: Cl.uint(3), // 5 - 2
        seller: Cl.principal(address1),
        active: Cl.bool(true)
      })
    );

    // Check earnings
    const earnings = simnet.callReadOnlyFn('coffee-farm-market', 'get-farmer-earnings', [Cl.principal(address1)], address1);
    expect(earnings.result).toBeUint(4000000); // 2 * 2000000
  });

  it('should deactivate item when sold out', () => {
    // List item
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Robusta Beans'),
        Cl.uint(2000000),
        Cl.uint(5)
      ],
      address1
    );

    // Buy all
    const { result } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(1),
        Cl.uint(5)
      ],
      address2
    );

    expect(result).toBeOk(Cl.bool(true));

    // Check deactivated
    const item = simnet.callReadOnlyFn('coffee-farm-market', 'get-coffee-item', [Cl.uint(1)], address1);
    expect(item.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii('Robusta Beans'),
        price: Cl.uint(2000000),
        quantity: Cl.uint(0),
        seller: Cl.principal(address1),
        active: Cl.bool(false)
      })
    );

    // Check earnings updated
    const earnings = simnet.callReadOnlyFn('coffee-farm-market', 'get-farmer-earnings', [Cl.principal(address1)], address1);
    expect(earnings.result).toBeUint(10000000); // 5 * 2000000
  });

  it('should handle error cases', () => {
    // List with empty name
    const { result: result1 } = simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii(''),
        Cl.uint(1000000),
        Cl.uint(10)
      ],
      address1
    );
    expect(result1).toBeErr(Cl.uint(7));

    // List with zero price
    const { result: result2 } = simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Beans'),
        Cl.uint(0),
        Cl.uint(10)
      ],
      address1
    );
    expect(result2).toBeErr(Cl.uint(1));

    // List with zero quantity
    const { result: result3 } = simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Beans'),
        Cl.uint(1000000),
        Cl.uint(0)
      ],
      address1
    );
    expect(result3).toBeErr(Cl.uint(2));

    // Buy non-existent item
    const { result: result4 } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(99),
        Cl.uint(1)
      ],
      address2
    );
    expect(result4).toBeErr(Cl.uint(4));

    // Buy zero quantity - first list an item
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Test Beans'),
        Cl.uint(1000000),
        Cl.uint(5)
      ],
      address1
    );

    const { result: result5 } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(1),
        Cl.uint(0)
      ],
      address2
    );
    expect(result5).toBeErr(Cl.uint(3));

    // Buy too much (insufficient quantity)
    const { result: result6 } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(1),
        Cl.uint(100)
      ],
      address2
    );
    expect(result6).toBeErr(Cl.uint(6));

    // Buy from inactive item
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Limited'),
        Cl.uint(1000000),
        Cl.uint(1)
      ],
      address1
    );
    
    simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(2),
        Cl.uint(1)
      ],
      address2
    );

    // Try to buy from now-inactive item
    const { result: result7 } = simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [
        Cl.uint(2),
        Cl.uint(1)
      ],
      address2
    );
    expect(result7).toBeErr(Cl.uint(5));
  });

  it('should return none for non-existent item', () => {
    const item = simnet.callReadOnlyFn(
      'coffee-farm-market',
      'get-coffee-item',
      [Cl.uint(999)],
      address1
    );
    expect(item.result).toBeNone();
  });

  it('should track multiple farmers earnings separately', () => {
    // Farmer 1 lists
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Farmer1 Coffee'),
        Cl.uint(1000000),
        Cl.uint(5)
      ],
      address1
    );

    // Farmer 2 lists
    simnet.callPublicFn(
      'coffee-farm-market',
      'list-coffee',
      [
        Cl.stringAscii('Farmer2 Coffee'),
        Cl.uint(2000000),
        Cl.uint(3)
      ],
      address2
    );

    // Buy from farmer 1
    simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [Cl.uint(1), Cl.uint(2)],
      address2
    );

    // Buy from farmer 2
    simnet.callPublicFn(
      'coffee-farm-market',
      'buy-coffee',
      [Cl.uint(2), Cl.uint(1)],
      address1
    );

    // Check earnings
    const earnings1 = simnet.callReadOnlyFn('coffee-farm-market', 'get-farmer-earnings', [Cl.principal(address1)], address1);
    expect(earnings1.result).toBeUint(2000000); // 2 * 1000000

    const earnings2 = simnet.callReadOnlyFn('coffee-farm-market', 'get-farmer-earnings', [Cl.principal(address2)], address2);
    expect(earnings2.result).toBeUint(2000000); // 1 * 2000000
  });

});
