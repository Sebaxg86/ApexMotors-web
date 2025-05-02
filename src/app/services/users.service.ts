import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:3000/api/users'; // Cambia si tu backend tiene otro puerto o ruta

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  loginUser(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // Método para registrar un usuario
  createUser(data: { email: string; password: string }): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}
