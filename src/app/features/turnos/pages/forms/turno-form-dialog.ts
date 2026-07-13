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
import { TipoTurno, Turno } from "../../models/turno.model";

export type TurnoFormValue = Omit<Turno, "id">;

@Component({
  selector: "app-turno-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: "./turno-form-dialog.html",
})
export class TurnoFormDialog {
  readonly abierto = input.required<boolean>();
  readonly guardando = input(false);
  readonly turnoEditar = input<Turno | null>(null);

  readonly guardar = output<TurnoFormValue>();
  readonly cerrar = output<void>();

  protected readonly tipos: TipoTurno[] = [
    "MATUTINO",
    "TARDE",
    "NOCTURNO",
    "COMPLETO",
  ];

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.nonNullable.group({
    tipo: ["MATUTINO" as TipoTurno, [Validators.required]],
    horaInicio: ["", [Validators.required]],
    horaFin: ["", [Validators.required]],
  });
  protected readonly esEdicion = computed(() => this.turnoEditar() !== null);

  constructor() {
    effect(() => {
      const turno = this.turnoEditar();
      this.formulario.reset({
        tipo: turno?.tipo ?? "MATUTINO",
        horaInicio: turno ? turno.horaInicio.slice(0, 5) : "",
        horaFin: turno ? turno.horaFin.slice(0, 5) : "",
      });
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
      tipo: valor.tipo,
      horaInicio: valor.horaInicio,
      horaFin: valor.horaFin,
    });
  }

  protected onCerrar(): void {
    this.formulario.reset({ tipo: "MATUTINO", horaInicio: "", horaFin: "" });
    this.cerrar.emit();
  }
}
