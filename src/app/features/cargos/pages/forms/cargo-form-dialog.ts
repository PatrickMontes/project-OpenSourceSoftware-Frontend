import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  output,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Cargo } from "../../models/cargo.model";

export type CargoFormValue = Omit<Cargo, "id">;

@Component({
  selector: "app-cargo-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: "./cargo-form-dialog.html",
})
export class CargoFormDialog {
  readonly abierto = input.required<boolean>();
  readonly guardando = input(false);
  readonly cargoEditar = input<Cargo | null>(null);

  readonly guardar = output<CargoFormValue>();
  readonly cerrar = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(3)]],
    salarioSemanal: [0, [Validators.required, Validators.min(0.01)]],
  });
  protected readonly esEdicion = computed(() => this.cargoEditar() !== null);

  constructor() {
    effect(() => {
      const cargo = this.cargoEditar();
      this.formulario.reset({
        nombre: cargo ? this.formatearNombre(cargo.nombre) : "",
        salarioSemanal: cargo?.salarioSemanal ?? 0,
      });
    });
  }

  private formatearNombre(nombre: string): string {
    return nombre
      .toLowerCase()
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    if (this.abierto()) this.onCerrar();
  }

  protected onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.formulario.getRawValue();

    this.guardar.emit({
      nombre: valor.nombre.trim().toUpperCase().replace(/\s+/g, "_"),
      salarioSemanal: valor.salarioSemanal,
    });
  }

  protected onCerrar(): void {
    this.formulario.reset({ nombre: "", salarioSemanal: 0 });
    this.cerrar.emit();
  }
}
