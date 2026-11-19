import { invoke } from "@tauri-apps/api/core";

export type AccountKind = "microsoft" | "offline" | "guest";
export interface Account {
  id: string;
  kind: AccountKind;
  name: string;
  uuid: string;
  skinUrl?: string;
}

// Chạy ngoài Tauri (trình duyệt) thì dùng dữ liệu giả để xem giao diện.
const inTauri = "__TAURI_INTERNALS__" in window;

let mockAccounts: Account[] = [
  { id: "g1", kind: "guest", name: "Player_4821", uuid: "00000000-0000-0000-0000-000000000000" },
];

export async function listAccounts(): Promise<Account[]> {
  if (!inTauri) return mockAccounts;
  return invoke<Account[]>("list_accounts");
}

export async function addOfflineAccount(name: string): Promise<Account> {
  if (!inTauri) {
    const a: Account = { id: crypto.randomUUID(), kind: "offline", name, uuid: crypto.randomUUID() };
    mockAccounts = [...mockAccounts, a];
    return a;
  }
  return invoke<Account>("add_offline_account", { name });
}

export async function launchGame(accountId: string, version: string, ramMb: number): Promise<void> {
  if (!inTauri) return new Promise((r) => setTimeout(r, 500));
  return invoke("launch_game", { accountId, version, ramMb });
}
