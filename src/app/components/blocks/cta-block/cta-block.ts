import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentBlock } from '../../../models';

@Component({
  selector: 'app-cta-block',
  imports: [RouterLink],
  templateUrl: './cta-block.html',
  styleUrl: './cta-block.scss',
})
export class CtaBlock {
  @Input() block!: ContentBlock;

  get heading(): string { return this.block.content['heading'] as string ?? ''; }
  get body(): string { return this.block.content['body'] as string ?? ''; }
  get buttonText(): string { return this.block.content['buttonText'] as string ?? ''; }
  get buttonUrl(): string { return this.block.content['buttonUrl'] as string ?? ''; }
}
