import { Component, Input } from '@angular/core';
import { ContentBlock } from '../../../models';

@Component({
  selector: 'app-divider-block',
  template: `<hr class="divider-block" [attr.data-style]="style" />`,
  styleUrl: './divider-block.scss',
})
export class DividerBlock {
  @Input() block!: ContentBlock;
  get style(): string { return this.block.content['style'] as string ?? 'thin'; }
}
