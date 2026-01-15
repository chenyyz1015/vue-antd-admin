import { localCache } from "./storage";

const TOKEN_KEY = "ACCESS_TOKEN";
const ACCOUNT_KEY = "ACCOUNT";
const PASSWORD_KEY = "PWD";

export function getToken(): string | null {
  return localCache.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  localCache.set(TOKEN_KEY, token);
}

export function removeToken(): void {
  localCache.remove(TOKEN_KEY);
}

export function getUserName(): string | null {
  return localCache.get(ACCOUNT_KEY);
}

export function setUserName(username: string): void {
  localCache.set(ACCOUNT_KEY, username);
}

export function removeUserName(): void {
  localCache.remove(ACCOUNT_KEY);
}

export function getPassword(): string | null {
  return localCache.get(PASSWORD_KEY);
}

export function setPassword(password: string): void {
  localCache.set(PASSWORD_KEY, password);
}

export function removePassword(): void {
  localCache.remove(PASSWORD_KEY);
}
