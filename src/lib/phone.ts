export const saudiMobile = /^(?:\+?966|00966|0)?5\d{8}$/;
export const normalizePhone = (s: string) => s.replace(/[\s\-()]/g, "");
