import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { dashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InscripcionesModule } from '../dashboard/pages/inscripciones/inscripciones.module';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Title } from '@angular/platform-browser';



@NgModule({
  declarations: [dashboardComponent],
  providers: [
    Title                   //Register the Service
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    InscripcionesModule,
    RouterModule,
    MatListModule,
    DashboardRoutingModule
  ],
  exports: [dashboardComponent],
})
export class dashboardModule {}
