import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardComponent } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { LoginGuard } from './auth/guards/login.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {path: 'dashboard',
  title:'Home',
  canActivate: [AuthGuard],
  component : dashboardComponent,
  loadChildren: ()=> import ('./dashboard/dashboard.module').then((m)=> m.dashboardModule)
  },
{
  path: 'auth',
  canActivate: [LoginGuard],
  component: AuthComponent,
  loadChildren: () => import('./auth/auth.module').then((m) => m.authModule),
},
  // RUTAS INDEFINIDAS....
  {
    // CUALQUIER RUTA
    path: '**',
    redirectTo: 'login',
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
