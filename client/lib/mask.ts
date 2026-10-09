// Müştəri şəxsi məlumatlarını modelə göndərməzdən əvvəl maskalayır.
export function maskPII(text: string): { text: string; count: number } {
  let count = 0;
  const rep = (re: RegExp, label: string) => {
    text = text.replace(re, () => {
      count++;
      return label;
    });
  };
  rep(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[EMAIL]");
  rep(/\b(?:\d[ -]?){13,19}\b/g, "[KART]");
  rep(/(?:\+?994|\b0)[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/g, "[TELEFON]");
  return { text, count };
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[“”«»"'`’‘]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
