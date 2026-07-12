import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../../../core/models/api-response.model";
import { Cargo } from "../../cargos/models/cargo.model";

@Injectable({ providedIn: "root" })
export class CargoService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/cargos";

  list(): Observable<ApiResponse<Cargo[]>> {
    return this.http.get<ApiResponse<Cargo[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Cargo>> {
    return this.http.get<ApiResponse<Cargo>>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Cargo, "id">): Observable<ApiResponse<Cargo>> {
    return this.http.post<ApiResponse<Cargo>>(`${this.apiUrl}/crear`, data);
  }

  update(id: number, data: Partial<Cargo>): Observable<ApiResponse<Cargo>> {
    return this.http.put<ApiResponse<Cargo>>(
      `${this.apiUrl}/actualizar/${id}`,
      data,
    );
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
