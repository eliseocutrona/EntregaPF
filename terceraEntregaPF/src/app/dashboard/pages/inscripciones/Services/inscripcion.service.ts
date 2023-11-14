import { Injectable } from '@angular/core';
import { Inscripcion } from '../inscripciones.component';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private inscripcion$ = new BehaviorSubject<Inscripcion[]>([]);
  constructor(private httpClient: HttpClient) {}

  get inscripcion(): Observable<Inscripcion[]> {
    return this.inscripcion$.asObservable();
  }

  obtenerInscripcion(): Observable<Inscripcion[]> {
    return this.httpClient
      .get<Inscripcion[]>(`${enviroment.apiBaseUrl}/inscripciones`)
      .pipe(
        tap((inscripciones) => this.inscripcion$.next(inscripciones)),
        mergeMap(() => this.inscripcion$.asObservable())
      );
  }

  obtenerAlumnosPorCurso(idCurso: number) {
    return this.httpClient
      .get<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones?idCurso=${idCurso}`
      )
      .pipe(
        tap((inscripciones) => this.inscripcion$.next(inscripciones)),
        mergeMap(() => this.inscripcion$.asObservable())
      );
  }

  obtenerAlumnos(): Observable<Inscripcion[]> {
    return this.inscripcion$.asObservable();
  }

  obtenerCursosDeAlumno(nroDocumento: number) {
    return this.httpClient
      .get<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones?numeroDocumentoAlumno=${nroDocumento}`
      )
      .pipe(
        tap((inscripciones) => this.inscripcion$.next(inscripciones)),
        mergeMap(() => this.inscripcion$.asObservable())
      );
  }
  inscribirAlumno(nuevaInscripcion: Inscripcion) {
    this.httpClient
      .post<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones/`,
        nuevaInscripcion
      )
      .subscribe();
    this.inscripcion$.pipe(take(1)).subscribe({
      next: (inscripciones) => {
        this.inscripcion$.next([nuevaInscripcion, ...inscripciones]);
      },
    });
  }

  eliminarInscripcion(
    inscripcionAEliminar: Inscripcion
  ): Observable<Inscripcion[]> {
    this.httpClient
      .delete<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones/${inscripcionAEliminar.id}`
      )
      .subscribe();
    this.inscripcion$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        const calumnosActualizados = alumnos.filter(
          (inscripcion) =>
            inscripcion.numeroDocumentoAlumno !=
              inscripcionAEliminar.numeroDocumentoAlumno &&
            inscripcion.idCurso != inscripcionAEliminar.idCurso
        );
        this.inscripcion$.next(calumnosActualizados);
      },
    });
    return this.inscripcion$.asObservable();
  }

  eliminarInscripcionCurso(
    inscripcionAEliminar: Inscripcion
  ): Observable<Inscripcion[]> {
    this.httpClient
      .delete<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones/${inscripcionAEliminar.id}`
      )
      .subscribe();
    this.inscripcion$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        const calumnosActualizados = alumnos.filter(
          (inscripcion) => inscripcion.idCurso != inscripcionAEliminar.idCurso
        );
        this.inscripcion$.next(calumnosActualizados);
      },
    });
    return this.inscripcion$.asObservable();
  }
  eliminarInscripcionAlumno(
    inscripcionAEliminar: Inscripcion
  ): Observable<Inscripcion[]> {
    this.httpClient
      .delete<Inscripcion[]>(
        `${enviroment.apiBaseUrl}/inscripciones/${inscripcionAEliminar.id}`
      )
      .subscribe();
    this.inscripcion$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        const calumnosActualizados = alumnos.filter(
          (inscripcion) =>
            inscripcion.numeroDocumentoAlumno !=
            inscripcionAEliminar.numeroDocumentoAlumno
        );
        this.inscripcion$.next(calumnosActualizados);
      },
    });
    return this.inscripcion$.asObservable();
  }
}
