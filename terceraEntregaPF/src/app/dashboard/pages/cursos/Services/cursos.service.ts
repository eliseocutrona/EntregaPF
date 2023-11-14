import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { Curso } from '../cursos.component';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private cursos$ = new BehaviorSubject<Curso[]>([]);

  constructor(private httpClient: HttpClient) {}

  get cursos(): Observable<Curso[]> {
    return this.cursos$.asObservable();
  }
  obtenerCurso(): Observable<Curso[]> {
    return this.httpClient.get<Curso[]>(`${enviroment.apiBaseUrl}/cursos`).pipe(
      tap((cursos) => this.cursos$.next(cursos)),
      mergeMap(() => this.cursos$.asObservable())
    );
  }

  obtenerCursoPorId(id: number): Observable<Curso | undefined> {
    return this.cursos$
      .asObservable()
      .pipe(map((cursos) => cursos.find((a) => a.id === id)));
  }

  eliminarCurso(cursoAEliminar: Curso): Observable<Curso[]> {
    this.httpClient
      .delete<Curso[]>(`${enviroment.apiBaseUrl}/cursos/${cursoAEliminar.id}`)
      .subscribe();

    this.cursos$.pipe(take(1)).subscribe({
      next: (cursos) => {
        const calumnosActualizados = cursos.filter(
          (curso) => curso.id != cursoAEliminar.id
        );
        this.cursos$.next(calumnosActualizados);
      },
    });
    return this.cursos$.asObservable();
  }
  crearCurso(nuevoCurso: Curso): Observable<Curso[]> {
    this.httpClient
      .post<Curso[]>(`${enviroment.apiBaseUrl}/cursos/`, nuevoCurso)
      .subscribe();
    this.cursos$.pipe(take(1)).subscribe({
      next: (cursos) => {
        this.cursos$.next([
          {
            id: cursos.length + 1,
            nombreCurso: nuevoCurso.nombreCurso,
            fechaInicio: nuevoCurso.fechaInicio,
            fechaFin: nuevoCurso.fechaFin,
          },
          ...cursos,
        ]);
      },
      complete: () => {},
      error: () => {},
    });
    return this.cursos$.asObservable();
  }
  editarCurso(
    cursoId: number,
    actualizacion: Partial<Curso>
  ): Observable<Curso[]> {
    this.httpClient
      .put<Curso[]>(`${enviroment.apiBaseUrl}/cursos/${cursoId}`, actualizacion)
      .subscribe();

    this.cursos$.pipe(take(1)).subscribe({
      next: (cursos) => {
        const cursosActualizados = cursos.map((curso) => {
          if (curso.id === cursoId) {
            return {
              ...curso,
              ...actualizacion,
            };
          } else {
            return curso;
          }
        });

        this.cursos$.next(cursosActualizados);
      },
    });

    return this.cursos$.asObservable();
  }
}
