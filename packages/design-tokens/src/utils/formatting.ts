/**
 * Convert string to PascalCase
 * @example toPascalCase('button-variant') // 'ButtonVariant'
 */
export function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Convert string to camelCase
 * @example toCamelCase('button-variants') // 'buttonVariants'
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to CONSTANT_CASE
 * @example toConstantCase('button-variant') // 'BUTTON_VARIANT'
 */
export function toConstantCase(str: string): string {
  return str.toUpperCase().replace(/-/g, "_");
}
