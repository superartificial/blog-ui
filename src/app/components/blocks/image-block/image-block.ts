import { Component, Input } from '@angular/core';
import { ContentBlock } from '../../../models';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
})
export class ImageBlock {
  @Input() block!: ContentBlock;

  get url(): string { return this.block.content['url'] as string ?? ''; }
  get alt(): string { return this.block.content['alt'] as string ?? ''; }
  get caption(): string { return this.block.content['caption'] as string ?? ''; }
}
