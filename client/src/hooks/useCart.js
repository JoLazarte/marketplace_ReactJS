// NUEVA VERSIÓN (REDUX TOOLKIT Y REACT REDUX)
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import { useMemo } from "react";

export function useCart() {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  // Calcular totales
  const cartCalculations = useMemo(() => {
    let total = 0;
    let itemCount = 0;

    cartItems.forEach(item => {
      const originalPrice = parseFloat(item.price);
      const hasDiscount = item.discountActive && item.discountPercentage > 0;
      const finalPrice = hasDiscount ? originalPrice * (1 - item.discountPercentage / 100) : originalPrice;
      
      total += finalPrice * item.quantity;
      itemCount += item.quantity;
    });

    return {
      total: total.toFixed(2),
      itemCount
    };
  }, [cartItems]);

  const getCartTotal = () => parseFloat(cartCalculations.total);
  const getItemCount = () => cartCalculations.itemCount;

  return {
    cartItems,
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
    getCartTotal,
    getItemCount,
  };
}