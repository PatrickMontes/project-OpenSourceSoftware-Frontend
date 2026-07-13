import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { Pago } from "../../models/pago.model";
import { PagoService } from "../../services/pago";
import { Empleado } from "../../../empleados/models/empleado.model";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { Planilla } from "../../../planillas/models/planilla.model";
import { PlanillaService } from "../../../planillas/services/planilla";
import { PagoFormDialog, PagoFormValue } from "../forms/pago-form-dialog";
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: "app-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CurrencyPipe, PagoFormDialog, ConfirmDialog],
  templateUrl: "./list.html",
})
export class List {
  private readonly service = inject(PagoService);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly planillaService = inject(PlanillaService);
  protected readonly pagos = signal<Pago[]>([]);
  protected readonly empleados = signal<Empleado[]>([]);
  protected readonly planillas = signal<Planilla[]>([]);
  protected readonly loading = signal(true);
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly filtro = signal("");
  protected readonly pagoAEliminar = signal<Pago | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly recalculandoId = signal<number | null>(null);

  protected readonly pagosFiltrados = computed(() => {
    const termino = this.filtro().trim().toLowerCase();
    if (!termino) return this.pagos();

    return this.pagos().filter((pago) =>
      this.nombreEmpleado(pago.empleadoId).toLowerCase().includes(termino),
    );
  });

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading.set(true);
    this.empleadoService.list().subscribe({
      next: (res) => this.empleados.set(res.data),
    });
    this.planillaService.list().subscribe({
      next: (res) => this.planillas.set(res.data),
    });
    this.service.list().subscribe({
      next: (res) => {
        this.pagos.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  protected nuevoPago(): void {
    this.mostrarFormulario.set(true);
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
  }

  protected generarPago(valor: PagoFormValue): void {
    this.guardando.set(true);
    this.service.create(valor.empleadoId, valor.planillaId).subscribe({
      next: (res) => {
        this.pagos.update((lista) => [...lista, res.data]);
        this.guardando.set(false);
        this.cerrarFormulario();
      },
      error: () => this.guardando.set(false),
    });
  }

  protected recalcularPago(pago: Pago): void {
    this.recalculandoId.set(pago.id);
    this.service.recalcular(pago.empleadoId).subscribe({
      next: (res) => {
        this.pagos.update((lista) =>
          lista.map((p) => (p.id === res.data.id ? res.data : p)),
        );
        this.recalculandoId.set(null);
      },
      error: () => this.recalculandoId.set(null),
    });
  }

  protected solicitarEliminar(pago: Pago): void {
    this.pagoAEliminar.set(pago);
  }

  protected cancelarEliminar(): void {
    this.pagoAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const pago = this.pagoAEliminar();
    if (!pago) return;

    this.eliminando.set(true);
    this.service.delete(pago.id).subscribe({
      next: () => {
        this.pagos.update((lista) => lista.filter((p) => p.id !== pago.id));
        this.eliminando.set(false);
        this.pagoAEliminar.set(null);
      },
      error: () => this.eliminando.set(false),
    });
  }

  protected nombreEmpleado(empleadoId: number): string {
    const empleado = this.empleados().find((e) => e.id === empleadoId);
    if (!empleado) return `Empleado #${empleadoId}`;
    return `${empleado.nombres} ${empleado.apellidos}`;
  }
}
