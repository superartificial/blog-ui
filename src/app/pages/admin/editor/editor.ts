import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { ImageService } from '../../../services/image.service';
import { Post } from '../../../models';
import EasyMDE from 'easymde';

const SECONDARY_TOOLBAR: EasyMDE.Options['toolbar'] = [
  'bold', 'italic', 'heading', '|',
  'quote', 'code', 'unordered-list', 'ordered-list', '|',
  'link', '|',
  'preview', 'side-by-side',
];

@Component({
  selector: 'app-editor',
  imports: [FormsModule, RouterLink],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements AfterViewInit, OnDestroy {
  @ViewChild('contentArea') contentAreaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('humanIntroArea') humanIntroAreaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('aiNotesArea') aiNotesAreaRef!: ElementRef<HTMLTextAreaElement>;

  private postService = inject(PostService);
  private imageService = inject(ImageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private mde: EasyMDE | null = null;
  private humanIntroMde: EasyMDE | null = null;
  private aiNotesMde: EasyMDE | null = null;

  isEditing = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  post: Post = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    humanIntro: '',
    aiNotes: '',
    status: 'DRAFT',
  };

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.loading.set(true);
      this.postService.getPostById(+id).subscribe({
        next: (post: Post) => {
          this.post = post;
          this.mde?.value(post.content ?? '');
          this.humanIntroMde?.value(post.humanIntro ?? '');
          this.aiNotesMde?.value(post.aiNotes ?? '');
          this.loading.set(false);
        },
        error: () => this.router.navigate(['/admin']),
      });
    }
  }

  ngAfterViewInit() {
    this.mde = new EasyMDE({
      element: this.contentAreaRef.nativeElement,
      spellChecker: false,
      autofocus: false,
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'code', 'unordered-list', 'ordered-list', '|',
        'link', 'upload-image', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide',
      ],
      imageUploadFunction: (file, onSuccess, onError) => {
        this.imageService.upload(file).subscribe({
          next: (url) => onSuccess(url),
          error: () => onError('Image upload failed'),
        });
      },
    });

    this.humanIntroMde = new EasyMDE({
      element: this.humanIntroAreaRef.nativeElement,
      spellChecker: false,
      autofocus: false,
      toolbar: SECONDARY_TOOLBAR,
      minHeight: '150px',
    });

    this.aiNotesMde = new EasyMDE({
      element: this.aiNotesAreaRef.nativeElement,
      spellChecker: false,
      autofocus: false,
      toolbar: SECONDARY_TOOLBAR,
      minHeight: '150px',
    });

    if (this.post.content) {
      this.mde.value(this.post.content);
    }
    if (this.post.humanIntro) {
      this.humanIntroMde.value(this.post.humanIntro);
    }
    if (this.post.aiNotes) {
      this.aiNotesMde.value(this.post.aiNotes);
    }
  }

  ngOnDestroy() {
    this.mde?.toTextArea();
    this.mde = null;
    this.humanIntroMde?.toTextArea();
    this.humanIntroMde = null;
    this.aiNotesMde?.toTextArea();
    this.aiNotesMde = null;
  }

  onTitleChange() {
    if (!this.isEditing()) {
      this.post.slug = this.slugify(this.post.title);
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  save() {
    const content = this.mde?.value() ?? '';
    if (!this.post.title.trim() || !this.post.slug.trim() || !content.trim()) {
      this.error.set('Title, slug, and content are required.');
      return;
    }

    this.post.content = content;
    this.post.humanIntro = this.humanIntroMde?.value() ?? '';
    this.post.aiNotes = this.aiNotesMde?.value() ?? '';
    this.loading.set(true);
    this.error.set(null);

    const request$ = this.isEditing()
      ? this.postService.updatePost(this.post.id!, this.post)
      : this.postService.createPost(this.post);

    request$.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        const msg = err.error?.error ?? 'Failed to save post. Please try again.';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}
