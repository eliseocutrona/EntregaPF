import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/AuthService';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.obtenerUsuarioAutenticado().pipe(
      map((usuarioAutenticado) => {
        if (usuarioAutenticado?.role !== 'admin') {
          alert('No posee permiso para acceder a este modulo');
          return this.router.createUrlTree(['dashboard']);
        } else {
          return true;
        }
      })
    );
  }
}
