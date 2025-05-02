import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseUrl = 'http://localhost:3000/api/sales'; // URL base para las rutas del backend

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas
  getSales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-sales`);
  }

  // Registrar una nueva venta
  registerSale(clientId: number, carId: number): Observable<any> {
    const body = { clientId, carId }; // Cuerpo de la solicitud POST
    return this.http.post(`${this.baseUrl}/register-sale`, body);
  }

  // Eliminar una venta
  deleteSale(saleId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${saleId}`);
  }
}
