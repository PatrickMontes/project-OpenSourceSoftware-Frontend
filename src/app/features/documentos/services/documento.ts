import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Documento } from '../models/documento.model';
import { API_BASE_URL } from '../../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/documentos`;

  list(): Observable<ApiResponse<Documento[]>> {
    return this.http.get<ApiResponse<Documento[]>>(`${this.apiUrl}/lista`);
  }

  search(params: {
    empleadoId?: number;
    tipoDocumento?: string;
  }): Observable<ApiResponse<Documento[]>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, v);
    });
    return this.http.get<ApiResponse<Documento[]>>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  create(file: File, empleadoId: number, tipoDocumento: string): Observable<ApiResponse<Documento>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('empleadoId', String(empleadoId));
    formData.append('tipoDocumento', tipoDocumento);

    return this.http.post<ApiResponse<Documento>>(`${this.apiUrl}/crear`, formData);
  }

  update(
    id: number,
    file?: File,
    empleadoId?: number,
    tipoDocumento?: string,
  ): Observable<ApiResponse<Documento>> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (empleadoId !== undefined) formData.append('empleadoId', String(empleadoId));
    if (tipoDocumento) formData.append('tipoDocumento', tipoDocumento);

    return this.http.put<ApiResponse<Documento>>(`${this.apiUrl}/actualizar/${id}`, formData);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/eliminar/${id}`);
  }
}
