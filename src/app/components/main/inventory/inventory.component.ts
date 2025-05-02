import { Component, OnInit, HostListener } from '@angular/core';
import { CarsService } from '../../../services/cars.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit{
  cars: any[] = []; // Lista de autos
  filteredCars: any[] = []; // Lista filtrada de autos
  newCar: any = { brand: '', model: '', year: '', cost: '', stock: '' }; // Nuevo auto
  carToEdit: any = { id: null, brand: '', model: '', year: '', cost: '', stock: '' };


  totalCars: number = 0; // Total de autos
  totalValue: number = 0; // Valor total de los autos

  filterText: string = ''; // Texto ingresado en el input de filtro
  filterCriteria: string = 'brand'; // Criterio de filtro por defecto

  constructor(private carsService: CarsService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadCars(); // Cargar autos al inicializar el componente
  }

  loadStatistics() {
    this.carsService.getInventoryStats().subscribe(
      (stats) => {
        console.log('Estadísticas recibidas:', stats); // Depuración
        this.totalCars = stats.TOTAL_CARS; // Asigna correctamente el valor
        this.totalValue = stats.TOTAL_VALUE; // Asigna correctamente el valor
      },
      (error) => {
        console.error('Error al obtener estadísticas:', error);
      }
    );
  }

  // Método para cargar todos los autos desde el servicio
  loadCars() {
    this.carsService.getCars().subscribe(
      (response) => {
        this.cars = response.map((car: any) => ({
          id: car.ID,
          brand: car.BRAND,
          model: car.MODEL,
          year: car.YEAR,
          cost: car.COST,
          stock: car.STOCK,
        }));
        this.filteredCars = [...this.cars]; // Inicializar la lista filtrada con todos los autos
      },
      (error) => {
        console.error('Error al cargar autos:', error);
        alert('Error al cargar autos');
      }
    );
  }

  // Método para filtrar autos
  filterCars() {
    const searchText = this.filterText.toLowerCase();
    this.filteredCars = this.cars.filter((car) =>
      car[this.filterCriteria]?.toString().toLowerCase().includes(searchText)
    );
  }

  // Método para agregar un nuevo auto
  addCar(form: NgForm) {
    if (form.valid) {
      this.carsService.createCar(this.newCar).subscribe(
        (response) => {
          alert('Auto agregado exitosamente');
          this.loadCars(); // Recargar la lista de autos
          this.loadStatistics();
          form.reset(); // Limpiar el formulario
        },
        (error) => {
          console.error('Error al agregar auto:', error);
          alert('Error al agregar auto');
        }
      );
    }
  }

  editCar(car: any) {
    this.carToEdit = { ...car }; // Copiar el auto seleccionado al objeto `carToEdit`
  }

  updateCar(form: NgForm) {
    if (form.valid) {
      this.carsService.updateCar(this.carToEdit.id, this.carToEdit).subscribe(
        () => {
          alert('Auto actualizado exitosamente');
          this.loadCars();
          this.loadStatistics();
          form.reset();
        },
        (error) => {
          console.error('Error al actualizar auto:', error);
          alert('Error al actualizar auto');
        }
      );
    }
  }

  

  // Método para aumentar el stock de un auto
  increaseStock(car: any) {
    const updatedCar = { ...car, stock: car.stock + 1 }; // Incrementar el stock
    this.carsService.updateCar(car.id, updatedCar).subscribe(
      () => this.loadCars(), // Recargar la lista de autos
      (error) => {
        console.error('Error al aumentar stock:', error);
        alert('Error al aumentar stock');
      }
    );
  }

  // Método para disminuir el stock de un auto
  decreaseStock(car: any) {
    if (car.stock > 0) {
      const updatedCar = { ...car, stock: car.stock - 1 }; // Decrementar el stock
      this.carsService.updateCar(car.id, updatedCar).subscribe(
        () => this.loadCars(), // Recargar la lista de autos
        (error) => {
          console.error('Error al disminuir stock:', error);
          alert('Error al disminuir stock');
        }
      );
    } else {
      alert('El stock no puede ser menor a 0');
    }
  }

  // Método para eliminar un auto
  deleteCar(car: any) {
    if (confirm(`¿Estás seguro de que deseas eliminar el auto "${car.model}"?`)) {
      this.carsService.deleteCar(car.id).subscribe(
        () => {
          alert('Auto eliminado exitosamente');
          this.loadCars(); // Recargar la lista de autos
          this.loadStatistics();
        },
        (error) => {
          console.error('Error al eliminar auto:', error);
          alert('Error al eliminar auto');
        }
      );
    }
  }
}
