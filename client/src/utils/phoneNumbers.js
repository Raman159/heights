export function parsePhoneNumbers(value) {
  return typeof value === "string"
    ? value.split(/[,\n;|]+/).map((number) => number.trim()).filter(Boolean)
    : [];
}

export function getTenDigitPhoneNumber(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? digits : null;
}
