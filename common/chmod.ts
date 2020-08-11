interface Flags {
  execute: boolean | null;
  read: boolean | null;
  write: boolean | null;
}

export interface Chmod {
  group: Flags;
  others: Flags;
  owner: Flags;
}
