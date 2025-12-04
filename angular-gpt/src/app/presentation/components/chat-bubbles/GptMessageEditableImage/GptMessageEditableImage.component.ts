import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  imports: [],
  templateUrl: './GptMessageEditableImage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent implements AfterViewInit {
  public text = input.required<string>();
  public imageInfo = input.required<{ url: string; alt: string }>();

  public onSelectedImage = output<string>();

  public canvasElement = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  public originalImage = signal<HTMLImageElement | null>(null);

  public isDrawing = signal(false);
  public cords = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngAfterViewInit(): void {
    if (!this.canvasElement()?.nativeElement) {
      return;
    }

    const canvas = this.canvasElement()!.nativeElement;
    const ctx = canvas?.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'Anonymous'; // enable cors in backend
    image.src = this.imageInfo().url;

    this.originalImage.set(image);

    image.onload = () => {
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  onMouseDown(event: MouseEvent) {
    if (!this.canvasElement()?.nativeElement) {
      return;
    }
    this.isDrawing.set(true);
    const startX =
      event.clientX -
      this.canvasElement()!.nativeElement.getBoundingClientRect().left;
    const startY =
      event.clientY -
      this.canvasElement()!.nativeElement.getBoundingClientRect().top;
    this.cords.set({ x: startX, y: startY });
  }

  onMouseMove(event: MouseEvent) {
    if (!this.canvasElement()?.nativeElement) {
      return;
    }
    if (!this.isDrawing()) {
      return;
    }
    const canvas = this.canvasElement()!.nativeElement;

    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;
    
    const width = currentX - this.cords().x;
    const height = currentY - this.cords().y;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(this.originalImage()!, 0, 0, canvasWidth, canvasHeight);

    ctx.clearRect(this.cords().x, this.cords().y, width, height);
  }

  onMouseUp() {
    this.isDrawing.set(false);

    const canvas = this.canvasElement()!.nativeElement!;
    const url = canvas.toDataURL('image/png');
    this.onSelectedImage.emit(url);
  }

  handleClick() {
    this.onSelectedImage.emit(this.imageInfo().url);
  }
}
