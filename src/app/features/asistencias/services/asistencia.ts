import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Asistencia } from '../models/asistencia.model';
import { API_BASE_URL } from '../../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/asistencias`;

  list(): Observable<ApiResponse<Asistencia[]>> {
    return this.http.get<ApiResponse<Asistencia[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Asistencia>> {
    return this.http.get<ApiResponse<Asistencia>>(`${this.apiUrl}/${id}`);
  }

  getByEmpleado(idEmpleado: number): Observable<ApiResponse<Asistencia[]>> {
    return this.http.get<ApiResponse<Asistencia[]>>(`${this.apiUrl}/empleado/${idEmpleado}`);
  }

  search(params: {
    empleadoId?: number;
    semanaId?: number;
    estado?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<ApiResponse<Asistencia[]>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, v);
    });

    return this.http.get<ApiResponse<Asistencia[]>>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  create(data: Partial<Asistencia>): Observable<ApiResponse<Asistencia>> {
    return this.http.post<ApiResponse<Asistencia>>(`${this.apiUrl}/crear`, data);
  }

  update(id: number, data: Partial<Asistencia>): Observable<ApiResponse<Asistencia>> {
    return this.http.put<ApiResponse<Asistencia>>(`${this.apiUrl}/actualizar/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<Asistencia>> {
    return this.http.delete<ApiResponse<Asistencia>>(`${this.apiUrl}/eliminar/${id}`);
  }
}

