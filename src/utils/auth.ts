import { localCache } from "./storage";

const TOKEN_KEY = "ACCESS_TOKEN";

export function getToken(): string | null {
  return localCache.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  localCache.set(TOKEN_KEY, token);
}

export function removeToken(): void {
  localCache.remove(TOKEN_KEY);
}
