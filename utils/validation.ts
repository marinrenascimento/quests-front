const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** E-mail com formato válido (o texto já deve vir sem espaços nas pontas) */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/** Senha com pelo menos 8 caracteres, com letras e números (RN-009) */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /\p{L}/u.test(password) && /\d/.test(password);
}
