import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Turno } from "../../models/turno.model";
import { TurnoService } from "../../services/turno";
import { TurnoFormDialog, TurnoFormValue } from "../forms/turno-form-dialog";
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: "app-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TurnoFormDialog, ConfirmDialog],
  templateUrl: "./list.html",
})
export class List {
  private readonly service = inject(TurnoService);
  protected readonly turnos = signal<Turno[]>([]);
  protected readonly loading = signal(true);
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly filtro = signal("");
  protected readonly turnoEnEdicion = signal<Turno | null>(null);
  protected readonly turnoAEliminar = signal<Turno | null>(null);
  protected readonly eliminando = signal(false);

  protected readonly turnosFiltrados = computed(() => {
    const termino = this.filtro().trim().toLowerCase();
    if (!termino) return this.turnos();

    return this.turnos().filter((turno) =>
      this.formatearTipo(turno.tipo).toLowerCase().includes(termino),
    );
  });

  constructor() {
    this.cargarTurnos();
  }

  private cargarTurnos(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (res) => {
        this.turnos.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  protected nuevoTurno(): void {
    this.turnoEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.turnoEnEdicion.set(null);
  }

  protected guardarTurno(valor: TurnoFormValue): void {
    this.guardando.set(true);
    const turno = this.turnoEnEdicion();

    const request$ = turno
      ? this.service.update(turno.id, valor)
      : this.service.create(valor);

    request$.subscribe({
      next: (res) => {
        this.turnos.update((lista) =>
          turno
            ? lista.map((t) => (t.id === turno.id ? res.data : t))
            : [...lista, res.data],
        );
        this.guardando.set(false);
        this.cerrarFormulario();
      },
      error: () => this.guardando.set(false),
    });
  }

  protected editarTurno(turno: Turno): void {
    this.turnoEnEdicion.set(turno);
    this.mostrarFormulario.set(true);
  }

  protected solicitarEliminar(turno: Turno): void {
    this.turnoAEliminar.set(turno);
  }

  protected cancelarEliminar(): void {
    this.turnoAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const turno = this.turnoAEliminar();
    if (!turno) return;

    this.eliminando.set(true);
    this.service.delete(turno.id).subscribe({
      next: () => {
        this.turnos.update((lista) => lista.filter((t) => t.id !== turno.id));
        this.eliminando.set(false);
        this.turnoAEliminar.set(null);
      },
      error: () => this.eliminando.set(false),
    });
  }

  protected formatearTipo(tipo: string): string {
    return tipo.charAt(0) + tipo.slice(1).toLowerCase();
  }

  protected formatearHora(hora: string): string {
    return hora.slice(0, 5);
  }
}
