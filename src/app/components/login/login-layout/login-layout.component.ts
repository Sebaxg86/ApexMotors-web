import { Component, NgModule } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login-layout',
  imports: [FormsModule, RouterModule],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css'
})
export class LoginLayoutComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private usersService: UsersService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = { email: this.email, password: this.password };

    this.usersService.loginUser(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token); // Guarda el token
        console.log('Inicio de sesión exitoso:', response);
        //alert('Inicio de sesión exitoso');
        this.router.navigate(['/']); // Redirige al home
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Correo o contraseña incorrectos.';
      },
    });
  }
}
