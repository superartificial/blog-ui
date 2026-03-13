import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface PendingDialog {
  config: DialogConfig;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly pending = signal<PendingDialog | null>(null);

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.pending.set({ config, resolve });
    });
  }

  respond(result: boolean) {
    const dialog = this.pending();
    if (dialog) {
      this.pending.set(null);
      dialog.resolve(result);
    }
  }
}
