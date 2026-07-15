import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "app-modal",
  standalone: true,
  template: `
    @if (abierto) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" (click)="cerrar.emit()"></div>
        <div
          role="dialog"
          aria-modal="true"
          class="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          (click)="$event.stopPropagation()"
        >
          <ng-content />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    if (this.abierto) {
      this.cerrar.emit();
    }
  }
}
