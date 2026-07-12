import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { EmpleadoService } from "../../services/empleado";
import { Empleado } from "../../models/empleado.model";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: "app-empleado-list",
  standalone: true,
  imports: [RouterLink, DatePipe, PageHeader],
  templateUrl: "./list.html",
})
export class List {
  private service = inject(EmpleadoService);

  empleados = signal<Empleado[]>([]);
  loading = signal(true);

  constructor() {
    this.service.list().subscribe({
      next: (res) => {
        this.empleados.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: number) {
    if (!confirm("¿Eliminar este empleado?")) return;
    this.service.delete(id).subscribe(() => {
      this.empleados.set(this.empleados().filter((e) => e.id !== id));
    });
  }
}
