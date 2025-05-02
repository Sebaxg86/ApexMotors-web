import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  // Crear un usuario
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  // Obtener todos los autos
  getCars(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cars`);
  }

  // Crear un auto
  createCar(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cars`, data);
  }

  // Registrar una venta
  createSale(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sales`, data);
  }
}