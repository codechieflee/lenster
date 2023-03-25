/**
 * Sentry ignore
 */
export const denyUrls = [
  // Browser extensions
  /extensions\//i,
  /^chrome:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-web-extension:\/\//i
];

export const ignoreErrors = [
  // Wallets
  /.*TrustWeb3Provider*/gm,
  /.*trustwallet*/gm,
  /.*solana*/gm,
  // Known errors
  /.*Loading chunk*/gm,
  /.*Load failed*/gm,
  /.*Cancel rendering route*/gm,
  /.*currentTarget, detail, isTrusted, target*/gm,
  /.*Network Error*/gm,
  /.*Failed to fetch*/gm,
  /.*User rejected request*/gm,
  /.*The source https*/gm,
  /.*Missing or invalid topic field*/gm,
  /.*AbortError: The user aborted a request*/gm,
  /.*Cannot read properties of undefined (reading 'slice')*/gm,
  /.*INVALID_ARGUMENT*/gm,
  /.*Invalid JSON RPC response*/gm,
  /.*Blocked a frame with origin*/gm,
  /.*User closed modal*/gm,
  /.*Non-Error promise rejection captured with keys: code, message, stack*/gm,
  /.*Something went wrong!*/gm
];
