import { Component } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import links from './nav-items';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/AuthService';
import { Usuario } from '../core/models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class dashboardComponent {
  authUser$: Observable<Usuario | null>;
  suscripcionAuthUser: Subscription | null = null;
  destroyed$ = new Subject<void>();

  links = links;
  constructor(private authService: AuthService, private router: Router) {
    this.authUser$ = this.authService.obtenerUsuarioAutenticado();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}
