import { BehaviorSubject, Observable, of } from "rxjs";
import { Usuario } from "src/app/core/models";
import { LoginFormValue } from "../services/AuthService";

export const USUARIO_ADMIN_MOCK: Usuario = {
  id: 1,
  apellido: 'testapellido',
  email: 'test@mail.com',
  nombre: 'testnombre',
  role: 'admin',
  token: 'asdkjsanfkdams3u2hjdasfadsuh',
  password: '12312312',
}

export class AuthServiceMock {

  private authUser$ = new BehaviorSubject<Usuario | null>(null);

  login(formValue: LoginFormValue): void {
    this.authUser$.next(USUARIO_ADMIN_MOCK);
  }

  verificarToken(): Observable<boolean> {
    return of(true);
  }
}
