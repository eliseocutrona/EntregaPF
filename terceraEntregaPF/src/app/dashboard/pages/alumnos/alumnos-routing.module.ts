import { NgModule } from '@angular/core';
import { AlumnosComponent } from './alumnos.component';
import { DetalleAlumnosComponent } from './detalle/detalleAlumnos.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[  
  {  path: '',
  component: AlumnosComponent},
  {  path: ':id',
   component: DetalleAlumnosComponent}
 ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AlumnosRoutingModule { }
