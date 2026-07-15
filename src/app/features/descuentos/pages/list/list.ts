import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";

import { Descuento } from "../../models/descuento.model";
import { DescuentosStore } from "../../services/store";
import { DescuentoFormComponent } from "../form/form";
import { ModalComponent } from "../modal/modal";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { Empleado } from "../../../empleados/models/empleado.model";

@Component({
  selector: "app-descuentos-list",
  standalone: true,
  imports: [CurrencyPipe, DescuentoFormComponent, ModalComponent],
  templateUrl: "./list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List implements OnInit {
  protected readonly store = inject(DescuentosStore);
  private readonly empleadoService = inject(EmpleadoService);
  protected readonly empleados = signal<Empleado[]>([]);

  protected readonly descuentoSeleccionado = signal<Descuento | null>(null);
  protected readonly dialogoAbierto = signal(false);

  ngOnInit(): void {
    this.store.cargar();
    this.empleadoService.list().subscribe({
      next: (respuesta) => this.empleados.set(respuesta.data),
    });
  }

  protected nombreEmpleado(empleadoId: number): string {
    const empleado = this.empleados().find((e) => e.id === empleadoId);
    return empleado
      ? `${empleado.nombres} ${empleado.apellidos}`
      : `Empleado #${empleadoId}`;
  }

  protected abrirCrear(): void {
    this.descuentoSeleccionado.set(null);
    this.dialogoAbierto.set(true);
  }

  protected abrirEditar(descuento: Descuento): void {
    this.descuentoSeleccionado.set(descuento);
    this.dialogoAbierto.set(true);
  }

  protected cerrarDialogo(): void {
    this.dialogoAbierto.set(false);
    this.descuentoSeleccionado.set(null);
  }

  protected guardar(dto: Omit<Descuento, "id"> | Partial<Descuento>): void {
    const seleccionado = this.descuentoSeleccionado();

    if (seleccionado) {
      this.store.actualizar(seleccionado.id, dto);
    } else {
      this.store.crear(dto as Omit<Descuento, "id">);
    }

    this.cerrarDialogo();
  }

  protected eliminar(descuento: Descuento): void {
    const confirmado = confirm(
      `¿Eliminar el descuento de S/ ${descuento.monto.toFixed(2)} (${descuento.razon})?`,
    );

    if (confirmado) {
      this.store.eliminar(descuento.id);
    }
  }
}
