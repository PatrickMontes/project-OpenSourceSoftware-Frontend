import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Empleado, Direccion, ExamenMedico } from '../models/empleado.model';
import { API_BASE_URL } from '../../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/empleados`;

  list(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}/lista`);
  }

  get(id: number): Observable<ApiResponse<Empleado>> {
    return this.http.get<ApiResponse<Empleado>>(`${this.apiUrl}/${id}`);
  }

  search(params: {
    dni?: number; nombres?: string; apellidos?: string;
    sexo?: string; estado?: string; asegurado?: boolean;
  }): Observable<ApiResponse<Empleado[]>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, v);
    });
    return this.http.get<ApiResponse<Empleado[]>>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  create(data: Partial<Empleado>): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(`${this.apiUrl}/crear`, data);
  }

  update(id: number, data: Partial<Empleado>): Observable<ApiResponse<Empleado>> {
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/actualizar/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }

  updateDireccion(id: number, data: Direccion): Observable<ApiResponse<Empleado>> {
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/${id}/direccion`, data);
  }

  updateExamenMedico(id: number, data: ExamenMedico): Observable<ApiResponse<Empleado>> {
    return this.http.put<ApiResponse<Empleado>>(`${this.apiUrl}/${id}/examen-medico`, data);
  }
}
