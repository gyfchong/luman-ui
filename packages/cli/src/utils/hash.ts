import { createHash } from 'node:crypto'
import { readFile } from 'fs-extra'

/**
 * Compute SHA-256 hash of file content with line-ending normalization
 *
 * Line endings are normalized to LF (\n) to ensure consistent hashing
 * across Windows (CRLF) and Unix (LF) systems.
 *
 * @param filePath - Absolute path to file
 * @returns SHA-256 hash as hex string (64 characters)
 */
export async function hashFile(filePath: string): Promise<string> {
  const content = await readFile(filePath, 'utf-8')
  // Normalize CRLF to LF for consistent hashing across platforms
  const normalized = content.replace(/\r\n/g, '\n')
  return createHash('sha256').update(normalized, 'utf-8').digest('hex')
}

/**
 * Compute SHA-256 hash of string content
 *
 * Line endings are normalized to LF (\n) to ensure consistent hashing.
 *
 * @param content - String content to hash
 * @returns SHA-256 hash as hex string (64 characters)
 */
export function hashContent(content: string): string {
  // Normalize CRLF to LF for consistent hashing
  const normalized = content.replace(/\r\n/g, '\n')
  return createHash('sha256').update(normalized, 'utf-8').digest('hex')
}

/**
 * Hash multiple files and return combined hash
 *
 * Useful for multi-file components. File hashes are sorted alphabetically
 * before combining to ensure deterministic results regardless of input order.
 *
 * @param filePaths - Array of absolute file paths
 * @returns SHA-256 hash of combined file hashes
 */
export async function hashFiles(filePaths: string[]): Promise<string> {
  const hashes = await Promise.all(filePaths.map(hashFile))
  // Sort to ensure deterministic order regardless of input order
  const combined = hashes.sort().join('')
  return createHash('sha256').update(combined, 'utf-8').digest('hex')
}
