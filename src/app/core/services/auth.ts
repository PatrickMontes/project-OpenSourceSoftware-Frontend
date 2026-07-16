import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../features/auth/models/auth.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${API_BASE_URL}/api/auth`;

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, data)
      .pipe(timeout(15000));
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data)
      .pipe(timeout(15000));
  }
}
