import { Component, Input } from '@angular/core';
import { ContentBlock } from '../../../models';
import { RichTextBlock } from '../rich-text-block/rich-text-block';
import { HeroBlock } from '../hero-block/hero-block';
import { ImageBlock } from '../image-block/image-block';
import { HtmlBlock } from '../html-block/html-block';
import { DividerBlock } from '../divider-block/divider-block';
import { CtaBlock } from '../cta-block/cta-block';
import { BlogFeedBlock } from '../blog-feed-block/blog-feed-block';

@Component({
  selector: 'app-block-renderer',
  imports: [RichTextBlock, HeroBlock, ImageBlock, HtmlBlock, DividerBlock, CtaBlock, BlogFeedBlock],
  template: `
    @switch (block.blockType) {
      @case ('RICH_TEXT') { <app-rich-text-block [block]="block" /> }
      @case ('HERO')      { <app-hero-block      [block]="block" /> }
      @case ('IMAGE')     { <app-image-block     [block]="block" /> }
      @case ('HTML')      { <app-html-block      [block]="block" /> }
      @case ('DIVIDER')   { <app-divider-block   [block]="block" /> }
      @case ('CTA')       { <app-cta-block       [block]="block" /> }
      @case ('BLOG_FEED') { <app-blog-feed-block [block]="block" /> }
    }
  `,
})
export class BlockRenderer {
  @Input() block!: ContentBlock;
}
