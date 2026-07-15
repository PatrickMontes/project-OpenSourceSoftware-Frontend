import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Descuento } from "../models/descuento.model";

@Injectable({ providedIn: "root" })
export class DescuentoService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/descuentos";

  list(): Observable<ApiResponse<Descuento[]>> {
    return this.http.get<ApiResponse<Descuento[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Descuento>> {
    return this.http.get<ApiResponse<Descuento>>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Descuento, "id">): Observable<ApiResponse<Descuento>> {
    return this.http.post<ApiResponse<Descuento>>(`${this.apiUrl}/crear`, data);
  }

  update(
    id: number,
    data: Partial<Descuento>,
  ): Observable<ApiResponse<Descuento>> {
    return this.http.put<ApiResponse<Descuento>>(
      `${this.apiUrl}/actualizar/${id}`,
      data,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
