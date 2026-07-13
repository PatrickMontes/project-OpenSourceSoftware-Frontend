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
import { Planilla } from "../../models/planilla.model";
import { Semana } from "../../../semanas/models/semana.model";

export interface PlanillaFormValue {
  semanaId: number;
}

@Component({
  selector: "app-planilla-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: "./planilla-form-dialog.html",
})
export class PlanillaFormDialog {
  readonly abierto = input.required<boolean>();
  readonly guardando = input(false);
  readonly planillaEditar = input<Planilla | null>(null);
  readonly semanas = input<Semana[]>([]);

  readonly guardar = output<PlanillaFormValue>();
  readonly cerrar = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    semanaId: [0, [Validators.required, Validators.min(1)]],
  });
  protected readonly esEdicion = computed(() => this.planillaEditar() !== null);

  constructor() {
    effect(() => {
      const planilla = this.planillaEditar();
      this.formulario.reset({ semanaId: planilla?.semanaId ?? 0 });
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

    this.guardar.emit({
      semanaId: Number(this.formulario.getRawValue().semanaId),
    });
  }

  protected onCerrar(): void {
    this.formulario.reset({ semanaId: 0 });
    this.cerrar.emit();
  }
}
