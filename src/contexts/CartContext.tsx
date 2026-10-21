'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import { generateCartId, calcSubtotal } from '~lib/utils';
import type { CartItem, Product, SelectedVariantOption } from '~lib/types';

// ---------------------------------------------------------------------------
// State & Action types
// ---------------------------------------------------------------------------

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type Action =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; cartId: string }
  | { type: 'UPDATE_QUANTITY'; cartId: string; qty: number }
  | { type: 'UPDATE_NOTE'; cartId: string; note: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (i) => i.cartId === action.item.cartId,
      );
      if (existingIndex !== -1) {
        const updated = [...state.items];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + action.item.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: calcSubtotal(existing.basePrice, existing.variantSelections, newQty),
        };
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
    case 'UPDATE_QUANTITY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId
            ? { ...i, quantity: action.qty, subtotal: calcSubtotal(i.basePrice, i.variantSelections, action.qty) }
            : i,
        ),
      };
    }
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId
            ? { ...i, note: action.note, cartId: generateCartId(i.productId, i.variantSelections, action.note) }
            : i,
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  grandTotal: number;
  addToCart: (
    product: Product,
    qty: number,
    variantSelections: SelectedVariantOption[],
    note: string,
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  updateNote: (cartId: string, note: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const grandTotal = state.items.reduce((sum, i) => sum + i.subtotal, 0);

  function addToCart(
    product: Product,
    qty: number,
    variantSelections: SelectedVariantOption[],
    note: string,
  ) {
    const cartId = generateCartId(product.id, variantSelections, note);
    const subtotal = calcSubtotal(product.sellingPrice, variantSelections, qty);
    dispatch({
      type: 'ADD_ITEM',
      item: {
        cartId,
        productId: product.id,
        productName: product.name,
        basePrice: product.sellingPrice,
        imageUrl: product.imageUrl ?? undefined,
        variantSelections,
        note,
        quantity: qty,
        subtotal,
      },
    });
  }

  function removeFromCart(cartId: string) {
    dispatch({ type: 'REMOVE_ITEM', cartId });
  }

  function updateQuantity(cartId: string, qty: number) {
    dispatch({ type: 'UPDATE_QUANTITY', cartId, qty });
  }

  function updateNote(cartId: string, note: string) {
    dispatch({ type: 'UPDATE_NOTE', cartId, note });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' });
  }

  function openCart() {
    dispatch({ type: 'OPEN' });
  }

  function closeCart() {
    dispatch({ type: 'CLOSE' });
  }

  return (
    <CartContext.Provider
      value={{ items: state.items, isOpen: state.isOpen, totalItems, grandTotal, addToCart, removeFromCart, updateQuantity, updateNote, clearCart, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
