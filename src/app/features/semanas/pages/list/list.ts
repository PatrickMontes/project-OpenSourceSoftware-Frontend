import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Semana } from "../../models/semana.model";
import { SemanaService } from "../../services/semana";
import { Turno } from "../../../turnos/models/turno.model";
import { TurnoService } from "../../../turnos/services/turno";
import {
  SemanaFormDialog,
  SemanaFormValue,
} from "../forms/semana-form-dialog";
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: "app-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe, SemanaFormDialog, ConfirmDialog],
  templateUrl: "./list.html",
})
export class List {
  private readonly service = inject(SemanaService);
  private readonly turnoService = inject(TurnoService);
  protected readonly semanas = signal<Semana[]>([]);
  protected readonly turnos = signal<Turno[]>([]);
  protected readonly loading = signal(true);
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly filtro = signal("");
  protected readonly semanaEnEdicion = signal<Semana | null>(null);
  protected readonly semanaAEliminar = signal<Semana | null>(null);
  protected readonly eliminando = signal(false);

  protected readonly semanasFiltradas = computed(() => {
    const termino = this.filtro().trim().toLowerCase();
    if (!termino) return this.semanas();

    return this.semanas().filter(
      (semana) =>
        `semana ${semana.numeroSemana}`.includes(termino) ||
        semana.estado.toLowerCase().includes(termino) ||
        this.nombreTurno(semana.turnoId).toLowerCase().includes(termino),
    );
  });

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.loading.set(true);
    this.turnoService.list().subscribe({
      next: (res) => this.turnos.set(res.data),
    });
    this.service.list().subscribe({
      next: (res) => {
        this.semanas.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  protected nuevaSemana(): void {
    this.semanaEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.semanaEnEdicion.set(null);
  }

  protected guardarSemana(valor: SemanaFormValue): void {
    this.guardando.set(true);
    const semana = this.semanaEnEdicion();

    const request$ = semana
      ? this.service.update(semana.id, valor)
      : this.service.create(valor);

    request$.subscribe({
      next: (res) => {
        this.semanas.update((lista) =>
          semana
            ? lista.map((s) => (s.id === semana.id ? res.data : s))
            : [...lista, res.data],
        );
        this.guardando.set(false);
        this.cerrarFormulario();
      },
      error: () => this.guardando.set(false),
    });
  }

  protected editarSemana(semana: Semana): void {
    this.semanaEnEdicion.set(semana);
    this.mostrarFormulario.set(true);
  }

  protected solicitarEliminar(semana: Semana): void {
    this.semanaAEliminar.set(semana);
  }

  protected cancelarEliminar(): void {
    this.semanaAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const semana = this.semanaAEliminar();
    if (!semana) return;

    this.eliminando.set(true);
    this.service.delete(semana.id).subscribe({
      next: () => {
        this.semanas.update((lista) =>
          lista.filter((s) => s.id !== semana.id),
        );
        this.eliminando.set(false);
        this.semanaAEliminar.set(null);
      },
      error: () => this.eliminando.set(false),
    });
  }

  protected nombreTurno(turnoId: number): string {
    const turno = this.turnos().find((t) => t.id === turnoId);
    if (!turno) return `Turno #${turnoId}`;
    return turno.tipo.charAt(0) + turno.tipo.slice(1).toLowerCase();
  }

  protected formatearEstado(estado: string): string {
    return estado.charAt(0) + estado.slice(1).toLowerCase();
  }

  protected claseEstado(estado: string): string {
    switch (estado) {
      case "ACTIVA":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "COMPLETADA":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "CANCELADA":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  }
}
