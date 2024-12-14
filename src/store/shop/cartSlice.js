import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.items = action.payload;
      state.total = action.payload.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      state.total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
  },
});

export const { setCartItems, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
