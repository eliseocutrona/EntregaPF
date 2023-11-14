import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios.component';
import { DetalleUsuariosComponent } from './detalle-usuarios/detalle-usuarios.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[     
  {  path: '',
  component: UsuariosComponent},
  {  path: ':id',
   component: DetalleUsuariosComponent}
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]  
})
export class UsuariosRoutingModule { }
