class Clipboard {
  clipboard: string = null;

  clear(): void {
    this.clipboard = null;
  }

  readText(): string {
    return this.clipboard;
  }

  writeText(text: string): void {
    this.clipboard = text;
  }
}

export = Clipboard;
