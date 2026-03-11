import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EasyMDE from 'easymde';

@Component({
  selector: 'app-markdown-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditor),
      multi: true,
    },
  ],
  template: `<textarea #area></textarea>`,
  styleUrl: './markdown-editor.scss',
})
export class MarkdownEditor implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('area') areaRef!: ElementRef<HTMLTextAreaElement>;

  @Input() minHeight = '300px';
  @Input() imageUploadFn?: (
    file: File,
    onSuccess: (url: string) => void,
    onError: (error: string) => void
  ) => void;

  private mde: EasyMDE | null = null;
  private pendingValue: string | null = null;
  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit() {
    const toolbar: EasyMDE.Options['toolbar'] = this.imageUploadFn
      ? ['bold', 'italic', 'heading', '|', 'quote', 'code', 'unordered-list', 'ordered-list', '|',
         'link', 'upload-image', '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide']
      : ['bold', 'italic', 'heading', '|', 'quote', 'code', 'unordered-list', 'ordered-list', '|',
         'link', '|', 'preview', 'side-by-side'];

    this.mde = new EasyMDE({
      element: this.areaRef.nativeElement,
      spellChecker: false,
      autofocus: false,
      minHeight: this.minHeight,
      toolbar,
      imageUploadFunction: this.imageUploadFn,
    });

    if (this.pendingValue !== null) {
      this.mde.value(this.pendingValue);
      this.pendingValue = null;
    }

    this.mde.codemirror.on('change', () => {
      this.onChange(this.mde!.value());
      this.onTouched();
    });
  }

  ngOnDestroy() {
    this.mde?.toTextArea();
    this.mde = null;
  }

  writeValue(value: string | null): void {
    const val = value ?? '';
    if (this.mde) {
      if (this.mde.value() !== val) this.mde.value(val);
    } else {
      this.pendingValue = val;
    }
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
