import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Turno } from "../models/turno.model";
import { API_BASE_URL } from "../../../core/config/api.config";

@Injectable({ providedIn: "root" })
export class TurnoService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/turnos`;

  list(): Observable<ApiResponse<Turno[]>> {
    return this.http.get<ApiResponse<Turno[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Turno>> {
    return this.http.get<ApiResponse<Turno>>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Turno, "id">): Observable<ApiResponse<Turno>> {
    return this.http.post<ApiResponse<Turno>>(`${this.apiUrl}/crear`, data);
  }

  update(id: number, data: Partial<Turno>): Observable<ApiResponse<Turno>> {
    return this.http.put<ApiResponse<Turno>>(
      `${this.apiUrl}/actualizar/${id}`,
      data,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
