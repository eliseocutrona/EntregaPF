import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './pages/login/login.module';
import { AuthComponent } from './auth.component';
import { AuthService } from './services/AuthService';
import { AuthRoutingModule } from './auth-routing.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AuthComponent],
  providers: [AuthService],
  imports: [
    CommonModule,
    LoginModule,
    AuthRoutingModule,
    MatCardModule,
    
  ],
  exports: [
    AuthComponent
  ]
})
export class authModule { }
