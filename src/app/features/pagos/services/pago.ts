import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Pago } from "../models/pago.model";

@Injectable({ providedIn: "root" })
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/pagos";

  list(): Observable<ApiResponse<Pago[]>> {
    return this.http.get<ApiResponse<Pago[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Pago>> {
    return this.http.get<ApiResponse<Pago>>(`${this.apiUrl}/${id}`);
  }

  create(empleadoId: number, planillaId: number): Observable<ApiResponse<Pago>> {
    const params = new HttpParams()
      .set("empleadoId", empleadoId)
      .set("planillaId", planillaId);
    return this.http.post<ApiResponse<Pago>>(`${this.apiUrl}/crear`, null, {
      params,
    });
  }

  porPlanilla(planillaId: number): Observable<ApiResponse<Pago[]>> {
    const params = new HttpParams().set("planillaId", planillaId);
    return this.http.get<ApiResponse<Pago[]>>(`${this.apiUrl}/buscar`, {
      params,
    });
  }

  recalcular(empleadoId: number): Observable<ApiResponse<Pago>> {
    return this.http.put<ApiResponse<Pago>>(
      `${this.apiUrl}/recalcular/empleado/${empleadoId}`,
      null,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
