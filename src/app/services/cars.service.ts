import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private baseUrl = 'http://localhost:3000/api/cars'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  getCars(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createCar(car: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, car);
  }

  updateCar(id: number, car: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getInventoryStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }
  
}
