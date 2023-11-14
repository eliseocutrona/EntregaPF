import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { Usuario } from 'src/app/core/models';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios$ = new BehaviorSubject<Usuario[]>([]);

  constructor(private httpClient: HttpClient) {}

  get usuarios(): Observable<Usuario[]> {
    return this.usuarios$.asObservable();
  }
  obtenerUsuario(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(`${enviroment.apiBaseUrl}/usuarios`)
    .pipe(
      tap((usuarios) => this.usuarios$.next(usuarios)),
      mergeMap(() => this.usuarios$.asObservable())
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario | undefined> {
    return this.usuarios$
      .asObservable()
      .pipe(map((usuarios) => usuarios.find((a) => a.id === id)));
  }

  eliminarUsuario(usuarioAEliminar: Usuario): Observable<Usuario[]> {
    this.httpClient.delete<Usuario[]>(`${enviroment.apiBaseUrl}/usuarios/${usuarioAEliminar.id}`).subscribe();
    this.usuarios$.pipe(take(1)).subscribe({
      next: (usuarios) => {
        const usuariosActualizados = usuarios.filter(
          (usuario) => usuario.id != usuarioAEliminar.id
        );
        this.usuarios$.next(usuariosActualizados);
      },
    });
    return this.usuarios$.asObservable();
  }


generarToken():string{
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 41; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
  crearUsuario(nuevoUsuario: Usuario) : Observable<Usuario[]> {
    this.httpClient.post<Usuario[]>(`${enviroment.apiBaseUrl}/usuarios/`,{...nuevoUsuario,token:this.generarToken()}).subscribe();
    this.usuarios$.pipe(take(1)).subscribe({
      next: (usuarios) => {
        this.usuarios$.next([
          {
            id: usuarios.length + 1,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            email: nuevoUsuario.email,
            password: nuevoUsuario.password,
            role: nuevoUsuario.role,
            token:this.generarToken()//nuevoUsuario.token
          },
          ...usuarios,
        ]);
      },
      complete: () => {},
      error: () => {},
    });
    return this.usuarios$.asObservable();
  }
  editarUsuario(
    usuarioId: number,
    actualizacion: Partial<Usuario>
  ): Observable<Usuario[]> {
    this.httpClient.put<Usuario[]>(`${enviroment.apiBaseUrl}/usuarios/${usuarioId}`,{...actualizacion,token:this.generarToken()}).subscribe();
     this.usuarios$.pipe(take(1))
    .subscribe({
       next: (usuarios) => {
         const usuarioActualizados = usuarios.map((usuario) => {
           if (usuario.id === usuarioId) {
             return {
               ...usuario,
               ...actualizacion,
               token:this.generarToken()
             };
           } else {
             return usuario;
           }
         });

         this.usuarios$.next(usuarioActualizados);
       },
     });
    return this.usuarios$.asObservable();
  }
}
