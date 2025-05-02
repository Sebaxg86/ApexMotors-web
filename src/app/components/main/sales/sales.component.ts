import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../../services/sales.service';
import { ClientsService } from '../../../services/clients.service';
import { CarsService } from '../../../services/cars.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [FormsModule, CommonModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  sales: any[] = [];
  totalSales: number = 0;
  totalIncome: number = 0;
  lastSaleDate: string = 'No disponible';
  

  clients: any[] = [];
  cars: any[] = [];
  selectedClientId: number | null = null;
  selectedCarId: number | null = null;

  selectedFilter: string = 'SALE_ID'; // Filtro seleccionado por defecto
  filterValue: string = ''; // Valor del filtro
  filteredSales: any[] = []; // Ventas filtradas

  constructor(private salesService: SalesService,
    private clientsService: ClientsService,
    private carsService: CarsService) {}

  ngOnInit(): void {
    this.loadSales();
    this.loadClients();
    this.loadCars();
  }

  // Cargar las ventas desde el servicio
  loadSales(): void {
    this.salesService.getSales().subscribe(
      (data) => {
        this.sales = data;
        this.filteredSales = [...this.sales];
        this.calculateStatistics();
      },
      (error) => {
        console.error('Error al cargar las ventas:', error);
      }
    );
  }

  // Cargar los clientes desde el servicio
  loadClients(): void {
    this.clientsService.getClients().subscribe(
      (response) => {
        console.log('Clientes cargados:', response); // Verifica aquí
        this.clients = response;
      },
      (error) => console.error('Error al cargar clientes:', error)
    );
  }

  // Cargar los autos desde el servicio
  loadCars(): void {
    this.carsService.getCars().subscribe(
      (data) => {
        console.log('Autos cargados desde el backend:', data);
        this.cars = data.filter((car: any) => car.STOCK > 0); // Asegúrate de que STOCK > 0
      },
      (error) => {
        console.error('Error al cargar los autos:', error);
      }
    );
  }

  // Calcular estadísticas
  calculateStatistics(): void {
    this.totalSales = this.sales.length;
    this.totalIncome = this.sales.reduce(
      (sum, sale) => sum + sale.TOTAL_PRICE,
      0
    );
    this.lastSaleDate = this.sales.length > 0 ? this.sales[0].SALE_DATE : 'No disponible';
  }

  // Eliminar una venta
  deleteSale(saleId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.salesService.deleteSale(saleId).subscribe(
        () => {
          alert('Venta eliminada exitosamente');
          this.loadSales(); // Recargar las ventas después de eliminar
        },
        (error) => {
          console.error('Error al eliminar la venta:', error);
          alert('No se pudo eliminar la venta.');
        }
      );
    }
  }

  // Agregar una nueva venta
  addSale(): void {
    if (!this.selectedClientId || !this.selectedCarId) {
      alert('Por favor, selecciona un cliente y un auto.');
      return;
    }
  
    console.log('Datos enviados:', {
      clientId: this.selectedClientId,
      carId: this.selectedCarId,
    });
  
    this.salesService.registerSale(this.selectedClientId, this.selectedCarId)
      .subscribe(
        () => {
          alert('Venta registrada exitosamente');
          this.loadSales();
          this.loadCars();
          this.selectedClientId = null;
          this.selectedCarId = null;
          const closeButton = document.querySelector('#addSaleModal .btn-close') as HTMLElement;
          closeButton.click();
        },
        (error) => {
          console.error('Error al registrar la venta:', error);
          alert('No se pudo registrar la venta.');
        }
      );
  }

  applyFilter(): void {
    if (!this.filterValue.trim()) {
      this.filteredSales = [...this.sales]; // Si el input está vacío, mostrar todas las ventas
      return;
    }
  
    if (this.selectedFilter === 'MONTH') {
      this.filteredSales = this.sales.filter((sale) => {
        const saleMonth = new Date(sale.SALE_DATE).getMonth() + 1; // Obtener el mes de la fecha
        return saleMonth.toString().includes(this.filterValue);
      });
    } else {
      this.filteredSales = this.sales.filter((sale) =>
        sale[this.selectedFilter].toString().toLowerCase().includes(this.filterValue.toLowerCase())
      );
    }
  }




}
