import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main/main-layout/main-layout.component';
import { HomeComponent } from './components/main/home/home.component';
import { InventoryComponent } from './components/main/inventory/inventory.component';
import { SalesComponent } from './components/main/sales/sales.component';
import { ClientsComponent } from './components/main/clients/clients.component';
import { LoginLayoutComponent } from './components/login/login-layout/login-layout.component';
import { AuthGuard } from './auth/auth.guard'; 

export const routes: Routes = [
        {path: '', 
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
                        { path: '', component: HomeComponent },
                        { path: 'inventory', component: InventoryComponent },
                        { path: 'sales', component: SalesComponent },
                        { path: 'clients', component: ClientsComponent }]},
        { path: 'login', component: LoginLayoutComponent, canActivate: [AuthGuard]},
        { path: '**', redirectTo: 'login' }
];
