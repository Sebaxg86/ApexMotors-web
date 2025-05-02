import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseUrl = 'http://localhost:3000/api/clients'; // URL base para las rutas del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes
  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Crear un cliente
  createClient(client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, client);
  }

  // Actualizar un cliente
  updateClient(id: number, client: any): Observable<any> {
    console.log('Datos enviados al backend:', client); // Debug
    return this.http.put(`${this.baseUrl}/${id}`, client);
  }

  // Eliminar un cliente
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener las compras de un cliente específico
  getClientPurchases(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/purchases`);
  }

  // Obtener el nombre del cliente VIP
  getVipClientName(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vip-name`);
  }

  getTotalClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/total-clients`);
  }
  
  getLastRegistrationDate(): Observable<any> {
    return this.http.get(`${this.baseUrl}/last-registration-date`);
  }
}
