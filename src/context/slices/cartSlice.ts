import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string | null;
  size: string | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// Line items are unique per product + selected variant
type CartLineKey = Pick<CartItem, "productId" | "color" | "size">;

const initialState: CartState = {
  items: [],
};

function isSameLineItem(a: CartLineKey, b: CartLineKey): boolean {
  return (
    a.productId === b.productId && a.color === b.color && a.size === b.size
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find((item) =>
        isSameLineItem(item, action.payload)
      );

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({ ...action.payload, quantity: 1 });
    },

    removeItem(state, action: PayloadAction<CartLineKey>) {
      state.items = state.items.filter(
        (item) => !isSameLineItem(item, action.payload)
      );
    },

    decrementItem(state, action: PayloadAction<CartLineKey>) {
      const existing = state.items.find((item) =>
        isSameLineItem(item, action.payload)
      );

      if (!existing) return;

      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        state.items = state.items.filter((item) => item !== existing);
      }
    },

    // Replace the whole list when hydrating from the server cart
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, decrementItem, setItems } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
