export function isTokenExpired(expiresInSeconds: number) {
  const expirationTime = Date.now() + expiresInSeconds * 1000

  const isExpired = expirationTime < Date.now()

  return isExpired
}
