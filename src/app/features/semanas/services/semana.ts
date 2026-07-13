import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Semana } from "../models/semana.model";

@Injectable({ providedIn: "root" })
export class SemanaService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/semanas";

  list(): Observable<ApiResponse<Semana[]>> {
    return this.http.get<ApiResponse<Semana[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Semana>> {
    return this.http.get<ApiResponse<Semana>>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Semana, "id">): Observable<ApiResponse<Semana>> {
    return this.http.post<ApiResponse<Semana>>(`${this.apiUrl}/crear`, data);
  }

  update(id: number, data: Partial<Semana>): Observable<ApiResponse<Semana>> {
    return this.http.put<ApiResponse<Semana>>(
      `${this.apiUrl}/actualizar/${id}`,
      data,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
