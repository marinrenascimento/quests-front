/** Letras acentuadas do português (e algumas comuns em nomes estrangeiros) e a letra sem acento */
const ACCENTS: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
};

/**
 * Texto para comparar em buscas: minúsculas, sem acentos e sem espaços nas pontas.
 * Ex.: normalizeSearch('  História ') -> "historia". Usa uma tabela própria em vez de
 * String.normalize, para não depender do suporte do motor JS a Unicode.
 */
export function normalizeSearch(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, (char) => ACCENTS[char] ?? char);
}

/** Texto como parte de um id: normalizado e com hífen no lugar de espaços e símbolos. */
export function slugify(text: string): string {
  return normalizeSearch(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
