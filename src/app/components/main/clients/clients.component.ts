import { Component, NgModule, OnInit } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-clients',
  imports: [FormsModule, CommonModule, CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit{
  clients: any[] = []; // Lista completa de clientes
  clientToEdit: any = { id: null, fullName: '', email: '', phone: '' };
  newClient: any = { fullName: '', email: '', phone: '' }; // Nuevo cliente

  filteredClients: any[] = []; // Lista filtrada de clientes
  filterText: string = ''; // Texto de búsqueda
  filterCriteria: string = 'fullName'; // Criterio de búsqueda por defecto

  selectedClient: any = null; // Cliente seleccionado
  clientPurchases: any[] = []; // Lista de compras del cliente seleccionado

  totalClients: number = 0;
  lastRegistrationDate: string = '';
  vipClientName: string = '';
  

  constructor(private clientsService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.clientsService.getTotalClients().subscribe(
      (response) => {
        this.totalClients = response.total_clients;
      },
      (error) => {
        console.error('Error al obtener el total de clientes:', error);
      }
    );
  
    this.clientsService.getLastRegistrationDate().subscribe(
      (response) => {
        this.lastRegistrationDate = response.last_registration_date;
      },
      (error) => {
        console.error('Error al obtener la fecha del último cliente registrado:', error);
      }
    );
  
    this.clientsService.getVipClientName().subscribe(
      (response: any) => {
        this.vipClientName = response.name; // Cambiado de vip_client_name a name
      },
      (error: any) => {
        console.error('Error al obtener el cliente VIP:', error);
      }
    );
  }

  // Cargar los clientes desde el backend
  loadClients(): void {
    this.clientsService.getClients().subscribe(
      (response) => {
        console.log('Datos recibidos:', response); // Verifica que los datos llegan correctamente
        this.clients = response.map((client: any) => ({
          id: client.ID,
          fullName: client.FULL_NAME,
          email: client.EMAIL,
          phoneNumber: client.PHONE_NUMBER,
          registrationDate: client.REGISTRATION_DATE,
          carsPurchased: client.CARS_PURCHASED,
          totalSpent: client.TOTAL_SPENT,
        })); // Asigna el array directamente
        this.filteredClients = [...this.clients]; // Crea una copia para filtrados
      },
      (error) => console.error('Error al cargar clientes:', error)
    );
  }

  viewClientPurchases(client: any): void {
    
    this.selectedClient = client; // Asigna el cliente seleccionado
    this.clientPurchases = []; // Limpia las compras anteriores
    console.log('ID del cliente seleccionado:', client.id); // Verifica el ID enviado
    this.clientsService.getClientPurchases(client.id).subscribe(
      (purchases) => {
        console.log('Compras recibidas:', purchases); // Verifica las compras devueltas
        this.clientPurchases = purchases.map((purchase: any) => ({
          id: purchase.ID,
          sale_date: purchase.SALE_DATE,
          car_brand: purchase.CAR_BRAND,
          car_name: purchase.CAR_NAME,
          total_price: purchase.TOTAL_PRICE,
        })); // Asigna las compras recibidas
      },
      (error) => {
        console.error('Error al cargar compras:', error);
        alert('Error al cargar las compras del cliente.');
      }
    );
}

  // Filtrar clientes basado en texto y criterio
  filterClients(): void {
    const searchText = this.filterText.toLowerCase();
    this.filteredClients = this.clients.filter((client) => {
      const fieldValue = client[this.filterCriteria]?.toString().toLowerCase();
      return fieldValue?.includes(searchText);
    });
  }

  addClient(form: NgForm) {
    if (form.valid) {
      this.clientsService.createClient(this.newClient).subscribe(
        (response) => {
          alert('Cliente agregado exitosamente');
          this.loadClients(); // Recargar la lista de clientes
          this.loadStatistics();
          form.reset(); // Limpiar el formulario
          this.newClient = { fullName: '', email: '', phone: '' }; // Reiniciar el objeto
        },
        (error) => {
          console.error('Error al agregar cliente:', error);
          alert('Error al agregar cliente');
        }
      );
    }
  }

  

  // Método para eliminar un cliente
  deleteClient(client: any): void {
    if (confirm(`¿Estás seguro de eliminar al cliente ${client.fullName}?`)) {
      this.clientsService.deleteClient(client.id).subscribe(
        () => {
          // Eliminar cliente de la lista en el frontend
          this.clients = this.clients.filter((c) => c.id !== client.id);
          this.filteredClients = [...this.clients]; // Actualizar la lista filtrada
          this.loadStatistics();
          alert(`Cliente ${client.fullName} eliminado con éxito.`);
        },
        (error) => {
          console.error('Error al eliminar cliente:', error);
          alert('Ocurrió un error al intentar eliminar al cliente.');
        }
      );
    }
  }

  editClient(client: any): void {
    console.log('Cliente a editar:', client); // Debug
    this.clientToEdit = { ...client }; // Copiar los datos del cliente seleccionado
  }

  updateClient(form: NgForm) {
    if (form.valid) {
      console.log('Datos enviados para actualizar:', this.clientToEdit);
      this.clientsService.updateClient(this.clientToEdit.id, this.clientToEdit).subscribe(
        () => {
          alert('Cliente actualizado exitosamente');
          this.loadClients(); // Recargar la lista de clientes
          this.loadStatistics();
          form.reset(); // Limpiar el formulario
        },
        (error) => {
          console.error('Error al actualizar cliente:', error);
          alert('Error al actualizar cliente');
        }
      );
    }
  }
  
}
