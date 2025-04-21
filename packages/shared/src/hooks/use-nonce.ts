/**
 * Context and hook for managing Content Security Policy (CSP) nonces
 *
 * Nonces are used in CSP to allow specific inline scripts or styles that would
 * otherwise be blocked by the policy. This is particularly useful for server
 * rendering React applications where styles or scripts need to be inlined.
 *
 * @example
 * // In your root layout or provider component:
 * import { NonceProvider } from '@workspace/shared/hooks/use-nonce';
 *
 * function App({ nonce }) {
 *   return (
 *     <NonceProvider value={nonce}>
 *       <YourApplication />
 *     </NonceProvider>
 *   );
 * }
 *
 * // In a component that needs the nonce:
 * import { useNonce } from '@workspace/shared/hooks/use-nonce';
 *
 * function Component() {
 *   const nonce = useNonce();
 *   return <script nonce={nonce}>console.log('Allowed by CSP');</script>;
 * }
 */
import { createContext, useContext } from "react";

/**
 * Context for storing the CSP nonce value
 */
export const NonceContext = createContext<string>("");

/**
 * Provider component for the nonce context
 */
export const NonceProvider = NonceContext.Provider;

/**
 * Hook to access the current CSP nonce value
 * @returns The current nonce string
 */
export const useNonce = () => useContext(NonceContext);
