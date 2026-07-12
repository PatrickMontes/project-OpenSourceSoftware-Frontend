import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from "@angular/core";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (abierto()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        (click)="cancelar.emit()"
      >
        <div
          class="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          (click)="$event.stopPropagation()"
        >
          <h3 id="confirm-title" class="text-base font-semibold tracking-tight">
            {{ titulo() }}
          </h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ mensaje() }}
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              (click)="cancelar.emit()"
              [disabled]="procesando()"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="confirmar.emit()"
              [disabled]="procesando()"
              class="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              @if (procesando()) {
                <span
                  class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                ></span>
              }
              {{ textoConfirmar() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialog {
  readonly abierto = input.required<boolean>();
  readonly procesando = input(false);
  readonly titulo = input("¿Estás seguro?");
  readonly mensaje = input("Esta acción no se puede deshacer.");
  readonly textoConfirmar = input("Eliminar");

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    if (this.abierto()) this.cancelar.emit();
  }
}
