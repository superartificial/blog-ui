import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-divider-block-editor',
  imports: [FormsModule],
  template: `
    <div class="block-editor-field">
      <label>Style</label>
      <select [(ngModel)]="style" (ngModelChange)="emit()" name="style">
        <option value="thin">Thin</option>
        <option value="thick">Thick</option>
        <option value="decorative">Decorative</option>
      </select>
    </div>
  `,
})
export class DividerBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  style = 'thin';

  ngOnInit() {
    this.style = (this.content['style'] as string) ?? 'thin';
  }

  emit() {
    this.contentChange.emit({ style: this.style });
  }
}
