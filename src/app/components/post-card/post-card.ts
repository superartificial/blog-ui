import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostSummary, formatPostDate } from '../../models';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  post = input.required<PostSummary>();

  formatDate(date: string | number[] | undefined): string {
    return formatPostDate(date);
  }
}
