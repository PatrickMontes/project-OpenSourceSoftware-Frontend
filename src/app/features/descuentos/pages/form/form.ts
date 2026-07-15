import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Descuento } from "../../models/descuento.model";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { Empleado } from "../../../empleados/models/empleado.model";

@Component({
  selector: "app-descuento-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescuentoFormComponent implements OnInit, OnChanges {
  @Input() descuento: Descuento | null = null;
  @Input() guardando = false;

  @Output() guardar = new EventEmitter<
    Omit<Descuento, "id"> | Partial<Descuento>
  >();
  @Output() cancelar = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);

  protected readonly empleados = signal<Empleado[]>([]);
  protected readonly cargandoEmpleados = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    empleadoId: [0, [Validators.required, Validators.min(1)]],
    semanaId: [0, [Validators.required, Validators.min(1)]],
    monto: [0, [Validators.required, Validators.min(0.01)]],
    razon: ["", [Validators.required, Validators.maxLength(150)]],
  });

  protected get modoEdicion(): boolean {
    return this.descuento !== null;
  }

  ngOnInit(): void {
    this.cargandoEmpleados.set(true);
    this.empleadoService.list().subscribe({
      next: (respuesta) => this.empleados.set(respuesta.data),
      error: () => this.cargandoEmpleados.set(false),
      complete: () => this.cargandoEmpleados.set(false),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["descuento"]) {
      return;
    }

    if (this.descuento) {
      this.formulario.patchValue({
        empleadoId: this.descuento.empleadoId,
        semanaId: this.descuento.semanaId,
        monto: this.descuento.monto,
        razon: this.descuento.razon,
      });
    } else {
      this.formulario.reset({
        empleadoId: 0,
        semanaId: 0,
        monto: 0,
        razon: "",
      });
    }
  }

  protected onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.formulario.getRawValue());
  }

  protected onCancelar(): void {
    this.cancelar.emit();
  }
}
