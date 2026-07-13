import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Planilla } from "../../models/planilla.model";
import { PlanillaService } from "../../services/planilla";
import { Semana } from "../../../semanas/models/semana.model";
import { SemanaService } from "../../../semanas/services/semana";
import {
  PlanillaFormDialog,
  PlanillaFormValue,
} from "../forms/planilla-form-dialog";
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: "app-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CurrencyPipe,
    RouterLink,
    PlanillaFormDialog,
    ConfirmDialog,
  ],
  templateUrl: "./list.html",
})
export class List {
  private readonly service = inject(PlanillaService);
  private readonly semanaService = inject(SemanaService);
  protected readonly planillas = signal<Planilla[]>([]);
  protected readonly semanas = signal<Semana[]>([]);
  protected readonly loading = signal(true);
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly filtro = signal("");
  protected readonly planillaEnEdicion = signal<Planilla | null>(null);
  protected readonly planillaAEliminar = signal<Planilla | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly recalculandoId = signal<number | null>(null);

  protected readonly planillasFiltradas = computed(() => {
    const termino = this.filtro().trim().toLowerCase();
    if (!termino) return this.planillas();

    return this.planillas().filter((planilla) =>
      this.nombreSemana(planilla.semanaId).toLowerCase().includes(termino),
    );
  });

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading.set(true);
    this.semanaService.list().subscribe({
      next: (res) => this.semanas.set(res.data),
    });
    this.service.list().subscribe({
      next: (res) => {
        this.planillas.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  protected nuevaPlanilla(): void {
    this.planillaEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.planillaEnEdicion.set(null);
  }

  protected guardarPlanilla(valor: PlanillaFormValue): void {
    this.guardando.set(true);
    const planilla = this.planillaEnEdicion();

    const request$ = planilla
      ? this.service.update(planilla.id, valor.semanaId)
      : this.service.generar(valor.semanaId);

    request$.subscribe({
      next: (res) => {
        this.planillas.update((lista) =>
          planilla
            ? lista.map((p) => (p.id === planilla.id ? res.data : p))
            : [...lista, res.data],
        );
        this.guardando.set(false);
        this.cerrarFormulario();
      },
      error: () => this.guardando.set(false),
    });
  }

  protected editarPlanilla(planilla: Planilla): void {
    this.planillaEnEdicion.set(planilla);
    this.mostrarFormulario.set(true);
  }

  protected recalcularTotal(planilla: Planilla): void {
    this.recalculandoId.set(planilla.id);
    this.service.recalcularTotal(planilla.id).subscribe({
      next: (res) => {
        this.planillas.update((lista) =>
          lista.map((p) => (p.id === res.data.id ? res.data : p)),
        );
        this.recalculandoId.set(null);
      },
      error: () => this.recalculandoId.set(null),
    });
  }

  protected solicitarEliminar(planilla: Planilla): void {
    this.planillaAEliminar.set(planilla);
  }

  protected cancelarEliminar(): void {
    this.planillaAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const planilla = this.planillaAEliminar();
    if (!planilla) return;

    this.eliminando.set(true);
    this.service.delete(planilla.id).subscribe({
      next: () => {
        this.planillas.update((lista) =>
          lista.filter((p) => p.id !== planilla.id),
        );
        this.eliminando.set(false);
        this.planillaAEliminar.set(null);
      },
      error: () => this.eliminando.set(false),
    });
  }

  protected nombreSemana(semanaId: number): string {
    const semana = this.semanas().find((s) => s.id === semanaId);
    if (!semana) return `Semana #${semanaId}`;
    return `Semana ${semana.numeroSemana}`;
  }
}
