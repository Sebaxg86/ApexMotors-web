import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token'); // Verifica si hay un token
    if (state.url === '/login' && token) {
      // Si el usuario ya está autenticado, redirígelo al home
      this.router.navigate(['/']);
      return false;
    }

    if (!token) {
      // Si no está autenticado, redirigir siempre al login
      if (state.url !== '/login') {
        this.router.navigate(['/login']);
      }
      return state.url === '/login';
    }

    return true; // Permite acceso si está autenticado
  }
}