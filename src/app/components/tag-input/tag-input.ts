import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-input',
  imports: [CommonModule],
  templateUrl: './tag-input.html',
  styleUrl: './tag-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInput),
      multi: true,
    },
  ],
})
export class TagInput implements ControlValueAccessor {
  existingTags = input<string[]>([]);

  @ViewChild('textInput') textInputRef!: ElementRef<HTMLInputElement>;

  tags = signal<string[]>([]);
  inputValue = signal('');
  dropdownOpen = signal(false);
  highlightedIndex = signal(-1);
  disabled = signal(false);

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  get suggestions(): string[] {
    const val = this.inputValue().toLowerCase().trim();
    const current = new Set(this.tags());
    return this.existingTags()
      .filter(t => !current.has(t) && (val === '' || t.toLowerCase().includes(val)))
      .slice(0, 10);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.highlightedIndex.set(-1);
    this.dropdownOpen.set(true);
  }

  onKeydown(event: KeyboardEvent) {
    // Read directly from the DOM element — more reliable than the signal
    const domValue = this.textInputRef?.nativeElement.value ?? '';
    const sug = this.suggestions;

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      event.stopPropagation();
      const idx = this.highlightedIndex();
      if (idx >= 0 && idx < sug.length) {
        this.addTag(sug[idx]);
      } else {
        const raw = domValue.replace(/,/g, '').trim();
        if (raw) this.addTag(raw);
      }
    } else if (event.key === 'Tab' && domValue.trim()) {
      // Commit typed text on Tab so it isn't lost when focus moves
      event.preventDefault();
      this.addTag(domValue);
    } else if (event.key === 'Backspace' && domValue === '') {
      const current = this.tags();
      if (current.length > 0) this.removeTag(current[current.length - 1]);
    } else if (event.key === 'Escape') {
      this.dropdownOpen.set(false);
      this.highlightedIndex.set(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex.set(Math.min(this.highlightedIndex() + 1, sug.length - 1));
      this.dropdownOpen.set(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex.set(Math.max(this.highlightedIndex() - 1, -1));
    }
  }

  onFocus() {
    this.dropdownOpen.set(true);
  }

  onBlur() {
    // Commit any pending typed text so it isn't lost when the user clicks Save
    setTimeout(() => {
      const pending = this.textInputRef?.nativeElement.value.trim();
      if (pending) this.addTag(pending);

      this.dropdownOpen.set(false);
      this.onTouched();
    }, 150);
  }

  addTag(name: string) {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;
    const current = this.tags();
    if (!current.includes(trimmed)) {
      const next = [...current, trimmed];
      this.tags.set(next);
      this.onChange(next);
    }
    this.inputValue.set('');
    if (this.textInputRef?.nativeElement) {
      this.textInputRef.nativeElement.value = '';
    }
    this.dropdownOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  removeTag(name: string) {
    const next = this.tags().filter(t => t !== name);
    this.tags.set(next);
    this.onChange(next);
  }

  selectSuggestion(tag: string) {
    this.addTag(tag);
    this.textInputRef.nativeElement.focus();
  }

  focusInput() {
    this.textInputRef.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  closeOnEscape() {
    this.dropdownOpen.set(false);
  }

  // ControlValueAccessor
  writeValue(value: string[]): void {
    this.tags.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
