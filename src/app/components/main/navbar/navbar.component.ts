import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null; // Simula el nombre del usuario autenticado

  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí podrías obtener el nombre del usuario desde localStorage o algún servicio
    this.username = localStorage.getItem('username') || 'ADMIN';
  }

  logout() {
    // Simula el cierre de sesión eliminando datos del localStorage
    localStorage.removeItem('token'); // Elimina el token
    this.router.navigate(['/login']); // Redirige al componente de login
  }
}
