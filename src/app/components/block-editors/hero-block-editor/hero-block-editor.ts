import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-block-editor',
  imports: [FormsModule],
  templateUrl: './hero-block-editor.html',
})
export class HeroBlockEditor implements OnInit {
  @Input() content: Record<string, unknown> = {};
  @Output() contentChange = new EventEmitter<Record<string, unknown>>();

  title = '';
  subtitle = '';
  bgImageUrl = '';
  ctaText = '';
  ctaUrl = '';

  ngOnInit() {
    this.title = (this.content['title'] as string) ?? '';
    this.subtitle = (this.content['subtitle'] as string) ?? '';
    this.bgImageUrl = (this.content['bgImageUrl'] as string) ?? '';
    this.ctaText = (this.content['ctaText'] as string) ?? '';
    this.ctaUrl = (this.content['ctaUrl'] as string) ?? '';
  }

  emit() {
    this.contentChange.emit({
      title: this.title,
      subtitle: this.subtitle,
      bgImageUrl: this.bgImageUrl,
      ctaText: this.ctaText,
      ctaUrl: this.ctaUrl,
    });
  }
}
