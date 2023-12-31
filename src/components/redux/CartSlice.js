import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      // const userData = localStorage.getItem("userData");
      // userId= userData.id;
      const existingIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
    
      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = {
          ...state.cartItems[existingIndex],
          quantity: state.cartItems[existingIndex].quantity + 1,
        };
    
        toast.info("Increased product quantity", {
          position: "bottom-left",
        });
      } else {
        let tempProductItem = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProductItem);
        toast.success("Product added to cart", {
          position: "bottom-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload
      );

      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
    
        toast.info("Decreased product quantity", {
          position: "bottom-left",
        });
      } else if (state.cartItems[itemIndex].quantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) => item._id !== action.payload
        );
    
        state.cartItems = nextCartItems;
    
        toast.error("Product removed from cart", {
          position: "bottom-left",
        });
      }
    
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    incrementCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].quantity += 1;

        toast.info("Increased product quantity", {
          position: "bottom-left",
        });

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    updateSizeInCart: (state, action) => {
      //const { productId, newSize } = action.payload;
       
      // Find the product in the cart by productId
      const product = state.cartItems.find((item) => item._id === action.payload.productId);
    console.log(action.payload);
      if (product) {
        // Update the size
        product.size = action.payload.newSize;
      }
    },

    // Action to update quantity of a product in the cart
    updateQuantityInCart: (state, action) => {
      const { productId, newQuantity } = action.payload;

      // Find the product in the cart by productId
      const product = state.cartItems.find((item) => item._id === productId);

      if (product) {
        // Update the quantity
        product.quantity = newQuantity;
      }
    },
    removeFromCart(state, action) {
      state.cartItems.map((cartItem) => {
        if (cartItem._id === action.payload._id) {
          console.log(action.payload._id)
          console.log(cartItem._id)
          const nextCartItems = state.cartItems.filter(
            (item) => item._id !== cartItem._id
          );

          state.cartItems = nextCartItems;

          toast.error("Product removed from cart", {
            position: "bottom-left",
          });
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        return state;
      });
    },
    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = price * quantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += quantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total);
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
    clearCart(state, action) {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error("Cart cleared", { position: "bottom-left" });
    },
  },
});

export const { addToCart, decreaseCart, removeFromCart, incrementCart, getTotals, clearCart , updateQuantityInCart,updateSizeInCart} =
  CartSlice.actions;

export default CartSlice.reducer;