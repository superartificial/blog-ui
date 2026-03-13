import { Component, HostListener, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  readonly dialogService = inject(DialogService);

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.dialogService.pending()) {
      this.dialogService.respond(false);
    }
  }
}
