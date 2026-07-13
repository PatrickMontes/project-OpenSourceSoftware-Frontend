import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Planilla } from "../models/planilla.model";

@Injectable({ providedIn: "root" })
export class PlanillaService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/planillas";

  list(): Observable<ApiResponse<Planilla[]>> {
    return this.http.get<ApiResponse<Planilla[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Planilla>> {
    return this.http.get<ApiResponse<Planilla>>(`${this.apiUrl}/${id}`);
  }

  generar(semanaId: number): Observable<ApiResponse<Planilla>> {
    return this.http.post<ApiResponse<Planilla>>(
      `${this.apiUrl}/generar/${semanaId}`,
      null,
    );
  }

  update(id: number, semanaId: number): Observable<ApiResponse<Planilla>> {
    const params = new HttpParams().set("semanaId", semanaId);
    return this.http.put<ApiResponse<Planilla>>(
      `${this.apiUrl}/actualizar/${id}`,
      null,
      { params },
    );
  }

  recalcularTotal(id: number): Observable<ApiResponse<Planilla>> {
    return this.http.put<ApiResponse<Planilla>>(
      `${this.apiUrl}/${id}/recalcular-total`,
      null,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
