export function getOfferPrices(offer) {
  const original = Number(offer?.original_price);
  const discounted = Number(offer?.discounted_price);
  if (
    !Number.isFinite(original) ||
    !Number.isFinite(discounted) ||
    original <= 0 ||
    discounted <= 0
  ) {
    return null;
  }
  return { original, discounted };
}

export function formatOfferPrice(price) {
  return Number(price).toLocaleString("en-NP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
