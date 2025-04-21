/**
 * Shared assets across applications
 *
 * In a monorepo architecture, there are two approaches to handle static assets:
 *
 * 1. Public folder approach:
 *    - Place assets in the `public` folder of each app
 *    - Refer to them with absolute paths like `/assets/logo.svg`
 *    - During build, these assets are copied to the app's output directory
 *
 * 2. Imported assets approach:
 *    - Import assets directly in components
 *    - Assets are processed by build tools (e.g., Vite, webpack)
 *    - This allows for optimization, hashing, and type safety
 *
 * For shared assets across multiple apps, you can:
 * - Keep them in the `packages/shared/src/assets/` directory
 * - Import them in your components
 * - The build system will handle copying them to the correct output location
 *
 * Example usage:
 * ```
 * import { Logo } from '@workspace/shared/assets';
 * // OR with direct imports
 * import Logo from '@workspace/shared/assets/logo.svg';
 * ```
 */

// Brand assets
export const Logo = "/assets/logo.svg";
export const LogoDark = "/assets/logo-dark.svg";
export const Favicon = "/assets/favicon.ico";
