import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentBlock } from '../../../models';

@Component({
  selector: 'app-hero-block',
  imports: [RouterLink],
  templateUrl: './hero-block.html',
  styleUrl: './hero-block.scss',
})
export class HeroBlock {
  @Input() block!: ContentBlock;

  get title(): string { return this.block.content['title'] as string ?? ''; }
  get subtitle(): string { return this.block.content['subtitle'] as string ?? ''; }
  get bgImageUrl(): string { return this.block.content['bgImageUrl'] as string ?? ''; }
  get ctaText(): string { return this.block.content['ctaText'] as string ?? ''; }
  get ctaUrl(): string { return this.block.content['ctaUrl'] as string ?? ''; }
}
