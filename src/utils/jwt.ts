export type JwtPayload = Record<string, any>;

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as T;
  } catch {
    return null;
  }
}
