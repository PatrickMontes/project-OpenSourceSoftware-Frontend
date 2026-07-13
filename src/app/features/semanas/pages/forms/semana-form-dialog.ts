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
import { EstadoSemana, Semana } from "../../models/semana.model";
import { Turno } from "../../../turnos/models/turno.model";

export type SemanaFormValue = Omit<Semana, "id">;

@Component({
  selector: "app-semana-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: "./semana-form-dialog.html",
})
export class SemanaFormDialog {
  readonly abierto = input.required<boolean>();
  readonly guardando = input(false);
  readonly semanaEditar = input<Semana | null>(null);
  readonly turnos = input<Turno[]>([]);

  readonly guardar = output<SemanaFormValue>();
  readonly cerrar = output<void>();

  protected readonly estados: EstadoSemana[] = [
    "ACTIVA",
    "COMPLETADA",
    "PENDIENTE",
    "CANCELADA",
  ];

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    fechaInicio: ["", [Validators.required]],
    fechaFin: ["", [Validators.required]],
    numeroSemana: [1, [Validators.required, Validators.min(1)]],
    turnoId: [0, [Validators.required, Validators.min(1)]],
    estado: ["ACTIVA" as EstadoSemana, [Validators.required]],
  });
  protected readonly esEdicion = computed(() => this.semanaEditar() !== null);

  constructor() {
    effect(() => {
      const semana = this.semanaEditar();
      this.formulario.reset({
        fechaInicio: semana?.fechaInicio ?? "",
        fechaFin: semana?.fechaFin ?? "",
        numeroSemana: semana?.numeroSemana ?? 1,
        turnoId: semana?.turnoId ?? 0,
        estado: semana?.estado ?? "ACTIVA",
      });
    });
  }

  protected formatearTipo(tipo: string): string {
    return tipo.charAt(0) + tipo.slice(1).toLowerCase();
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

    if (valor.fechaFin < valor.fechaInicio) {
      this.formulario.controls.fechaFin.setErrors({ ordenFechas: true });
      this.formulario.controls.fechaFin.markAsTouched();
      return;
    }

    this.guardar.emit({
      fechaInicio: valor.fechaInicio,
      fechaFin: valor.fechaFin,
      numeroSemana: valor.numeroSemana,
      turnoId: Number(valor.turnoId),
      estado: valor.estado,
    });
  }

  protected onCerrar(): void {
    this.formulario.reset({
      fechaInicio: "",
      fechaFin: "",
      numeroSemana: 1,
      turnoId: 0,
      estado: "ACTIVA",
    });
    this.cerrar.emit();
  }
}
