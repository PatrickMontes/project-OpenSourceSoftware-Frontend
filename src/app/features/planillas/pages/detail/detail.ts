import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Planilla } from "../../models/planilla.model";
import { PlanillaService } from "../../services/planilla";
import { Semana } from "../../../semanas/models/semana.model";
import { SemanaService } from "../../../semanas/services/semana";
import { Pago } from "../../../pagos/models/pago.model";
import { PagoService } from "../../../pagos/services/pago";
import { Empleado } from "../../../empleados/models/empleado.model";
import { EmpleadoService } from "../../../empleados/services/empleado";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: "app-detail",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, PageHeader],
  templateUrl: "./detail.html",
})
export class Detail {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PlanillaService);
  private readonly semanaService = inject(SemanaService);
  private readonly pagoService = inject(PagoService);
  private readonly empleadoService = inject(EmpleadoService);

  protected readonly planilla = signal<Planilla | null>(null);
  protected readonly semana = signal<Semana | null>(null);
  protected readonly pagos = signal<Pago[]>([]);
  protected readonly empleados = signal<Empleado[]>([]);
  protected readonly loading = signal(true);

  protected readonly totalPagos = computed(() =>
    this.pagos().reduce((suma, pago) => suma + pago.pagoNeto, 0),
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.cargarDatos(id);
  }

  private cargarDatos(id: number): void {
    this.loading.set(true);
    this.empleadoService.list().subscribe({
      next: (res) => this.empleados.set(res.data),
    });
    this.pagoService.porPlanilla(id).subscribe({
      next: (res) => this.pagos.set(res.data),
    });
    this.service.get(id).subscribe({
      next: (res) => {
        this.planilla.set(res.data);
        this.loading.set(false);
        this.semanaService.get(res.data.semanaId).subscribe({
          next: (resSemana) => this.semana.set(resSemana.data),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  protected nombreEmpleado(empleadoId: number): string {
    const empleado = this.empleados().find((e) => e.id === empleadoId);
    if (!empleado) return `Empleado #${empleadoId}`;
    return `${empleado.nombres} ${empleado.apellidos}`;
  }
}
