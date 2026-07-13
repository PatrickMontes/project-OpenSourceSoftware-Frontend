import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostListener,
  inject,
  input,
  output,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Empleado } from "../../../empleados/models/empleado.model";
import { Planilla } from "../../../planillas/models/planilla.model";

export interface PagoFormValue {
  empleadoId: number;
  planillaId: number;
}

@Component({
  selector: "app-pago-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: "./pago-form-dialog.html",
})
export class PagoFormDialog {
  readonly abierto = input.required<boolean>();
  readonly guardando = input(false);
  readonly empleados = input<Empleado[]>([]);
  readonly planillas = input<Planilla[]>([]);

  readonly guardar = output<PagoFormValue>();
  readonly cerrar = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    empleadoId: [0, [Validators.required, Validators.min(1)]],
    planillaId: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => {
      if (!this.abierto()) {
        this.formulario.reset({ empleadoId: 0, planillaId: 0 });
      }
    });
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
      empleadoId: Number(valor.empleadoId),
      planillaId: Number(valor.planillaId),
    });
  }

  protected onCerrar(): void {
    this.formulario.reset({ empleadoId: 0, planillaId: 0 });
    this.cerrar.emit();
  }
}
