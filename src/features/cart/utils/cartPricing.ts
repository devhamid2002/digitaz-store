// Checkout pricing lives here so the cart screen, the order review, and the
// server-side order creation all apply exactly the same rule.
export const FREE_SHIPPING_THRESHOLD = 100;
export const DEFAULT_SHIPPING_PRICE = 100;

type PriceableLine = {
  price: number | string;
  qty: number | string;
};

export function calculateCartTotals(lines: PriceableLine[]) {
  const itemsPrice = lines.reduce((total, line) => {
    const price = Number(line.price);
    const qty = Number(line.qty);

    if (!Number.isFinite(price) || !Number.isFinite(qty) || qty <= 0) {
      return total;
    }

    return total + price * qty;
  }, 0);

  const shippingPrice =
    lines.length === 0 || itemsPrice > FREE_SHIPPING_THRESHOLD
      ? 0
      : DEFAULT_SHIPPING_PRICE;

  return {
    itemsPrice,
    shippingPrice,
    totalPrice: itemsPrice + shippingPrice,
  };
}
