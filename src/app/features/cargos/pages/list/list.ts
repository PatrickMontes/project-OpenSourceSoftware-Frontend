import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { Cargo } from "../../models/cargo.model";
import { CargoService } from "../../services/cargo";
import { CargoFormDialog, CargoFormValue } from "../forms/cargo-form-dialog";
import { ConfirmDialog } from "../../../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: "app-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CurrencyPipe, CargoFormDialog, ConfirmDialog],
  templateUrl: "./list.html",
})
export class List {
  private readonly service = inject(CargoService);
  protected readonly cargos = signal<Cargo[]>([]);
  protected readonly loading = signal(true);
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly filtro = signal("");
  protected readonly cargoEnEdicion = signal<Cargo | null>(null);
  protected readonly cargoAEliminar = signal<Cargo | null>(null);
  protected readonly eliminando = signal(false);

  protected readonly cargosFiltrados = computed(() => {
    const termino = this.filtro().trim().toLowerCase();
    if (!termino) return this.cargos();

    return this.cargos().filter((cargo) =>
      this.formatearNombre(cargo.nombre).toLowerCase().includes(termino),
    );
  });

  constructor() {
    this.cargarCargos();
  }

  private cargarCargos(): void {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (res) => {
        this.cargos.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  protected nuevoCargo(): void {
    this.cargoEnEdicion.set(null);
    this.mostrarFormulario.set(true);
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.cargoEnEdicion.set(null);
  }

  protected guardarCargo(valor: CargoFormValue): void {
    this.guardando.set(true);
    const cargo = this.cargoEnEdicion();

    const request$ = cargo
      ? this.service.update(cargo.id, valor)
      : this.service.create(valor);

    request$.subscribe({
      next: (res) => {
        this.cargos.update((lista) =>
          cargo
            ? lista.map((c) => (c.id === cargo.id ? res.data : c))
            : [...lista, res.data],
        );
        this.guardando.set(false);
        this.cerrarFormulario();
      },
      error: () => this.guardando.set(false),
    });
  }

  protected editarCargo(cargo: Cargo): void {
    this.cargoEnEdicion.set(cargo);
    this.mostrarFormulario.set(true);
  }

  protected solicitarEliminar(cargo: Cargo): void {
    this.cargoAEliminar.set(cargo);
  }

  protected cancelarEliminar(): void {
    this.cargoAEliminar.set(null);
  }

  protected confirmarEliminar(): void {
    const cargo = this.cargoAEliminar();
    if (!cargo) return;

    this.eliminando.set(true);
    this.service.delete(cargo.id).subscribe({
      next: () => {
        this.cargos.update((lista) => lista.filter((c) => c.id !== cargo.id));
        this.eliminando.set(false);
        this.cargoAEliminar.set(null);
      },
      error: () => this.eliminando.set(false),
    });
  }

  protected formatearNombre(nombre: string): string {
    return nombre
      .toLowerCase()
      .split("_")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }
}
