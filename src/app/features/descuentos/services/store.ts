import { Injectable, computed, inject, signal } from "@angular/core";
import { catchError, finalize, of, tap } from "rxjs";
import { DescuentoService } from "./descuento";
import { Descuento } from "../models/descuento.model";

@Injectable({ providedIn: "root" })
export class DescuentosStore {
  private readonly descuentoService = inject(DescuentoService);

  private readonly _descuentos = signal<Descuento[]>([]);
  private readonly _cargando = signal(false);
  private readonly _guardando = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly descuentos = this._descuentos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly guardando = this._guardando.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalDescuentos = computed(() => this._descuentos().length);
  readonly montoTotalDescontado = computed(() =>
    this._descuentos().reduce(
      (acumulado, descuento) => acumulado + descuento.monto,
      0,
    ),
  );

  cargar(): void {
    this._cargando.set(true);
    this._error.set(null);

    this.descuentoService
      .list()
      .pipe(
        tap((respuesta) => this._descuentos.set(respuesta.data)),
        catchError(() => {
          this._error.set(
            "No se pudieron cargar los descuentos. Intenta nuevamente.",
          );
          return of(null);
        }),
        finalize(() => this._cargando.set(false)),
      )
      .subscribe();
  }

  crear(dto: Omit<Descuento, "id">): void {
    this._guardando.set(true);
    this._error.set(null);

    this.descuentoService
      .create(dto)
      .pipe(
        tap((respuesta) =>
          this._descuentos.update((lista) => [...lista, respuesta.data]),
        ),
        catchError(() => {
          this._error.set(
            "No se pudo crear el descuento. Verifica los datos e intenta de nuevo.",
          );
          return of(null);
        }),
        finalize(() => this._guardando.set(false)),
      )
      .subscribe();
  }

  actualizar(id: number, dto: Partial<Descuento>): void {
    this._guardando.set(true);
    this._error.set(null);

    this.descuentoService
      .update(id, dto)
      .pipe(
        tap((respuesta) =>
          this._descuentos.update((lista) =>
            lista.map((descuento) =>
              descuento.id === id ? respuesta.data : descuento,
            ),
          ),
        ),
        catchError(() => {
          this._error.set(
            "No se pudo actualizar el descuento. Verifica los datos e intenta de nuevo.",
          );
          return of(null);
        }),
        finalize(() => this._guardando.set(false)),
      )
      .subscribe();
  }

  eliminar(id: number): void {
    this._error.set(null);

    this.descuentoService
      .delete(id)
      .pipe(
        tap(() =>
          this._descuentos.update((lista) =>
            lista.filter((descuento) => descuento.id !== id),
          ),
        ),
        catchError(() => {
          this._error.set(
            "No se pudo eliminar el descuento. Intenta nuevamente.",
          );
          return of(null);
        }),
      )
      .subscribe();
  }
}
