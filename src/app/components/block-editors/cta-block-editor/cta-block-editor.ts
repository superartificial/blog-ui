import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cta-block-editor',
  imports: [FormsModule],
  template: `
    <div class="block-editor-fields">
      <div class="block-editor-field">
        <label>Heading</label>
        <input type="text" [(ngModel)]="heading" (ngModelChange)="emit()" name="heading" placeholder="CTA heading" />
      </div>
      <div class="block-editor-field">
        <label>Body text <span class="optional">(optional)</span></label>
        <input type="text" [(ngModel)]="body" (ngModelChange)="emit()" name="body" placeholder="Supporting text" />
      </div>
      <div class="block-editor-field">
        <label>Button text</label>
        <input type="text" [(ngModel)]="buttonText" (ngModelChange)="emit()" name="buttonText" placeholder="e.g. Get in touch" />
      </div>
      <div class="block-editor-field">
        <label>Button URL</label>
        <input type="text" [(ngModel)]="buttonUrl" (ngModelChange)="emit()" name="buttonUrl" placeholder="/contact" />
      </div>
    </div>
  `,
})
export class CtaBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  heading = '';
  body = '';
  buttonText = '';
  buttonUrl = '';

  ngOnInit() {
    this.heading = (this.content['heading'] as string) ?? '';
    this.body = (this.content['body'] as string) ?? '';
    this.buttonText = (this.content['buttonText'] as string) ?? '';
    this.buttonUrl = (this.content['buttonUrl'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({
      heading: this.heading,
      body: this.body,
      buttonText: this.buttonText,
      buttonUrl: this.buttonUrl,
    });
  }
}
