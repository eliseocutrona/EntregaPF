import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, mergeMap, take, tap } from 'rxjs';
import { Alumno } from '../alumnos.component';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environments';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private estudiantes$ = new BehaviorSubject<Alumno[]>([]);
  constructor(private httpClient: HttpClient) {}

  get alumnos(): Observable<Alumno[]> {
    return this.estudiantes$.asObservable();
  }

  obtenerAlumnos(): Observable<Alumno[]> {
    //return this.estudiantes$.asObservable();
    return this.httpClient.get<Alumno[]>(`${enviroment.apiBaseUrl}/alumnos`)
    .pipe(
      tap((alumno) => this.estudiantes$.next(alumno)),
      mergeMap(() => this.estudiantes$.asObservable())
    );
  }

  obtenerAlumnoPorId(id: number): Observable<Alumno | undefined> {
    return this.estudiantes$
      .asObservable()
      .pipe(
        map((alumnos) =>
          alumnos.find((a) => a.id === id)
        )
      );
  }
  // crearId(id: number){

  //   while (this.obtenerAlumnoPorId(id)) {
  //     id = id+1;
  //   }
  //   return id;
  // }

  crearAlumno(nuevoAlumno: Alumno)  : Observable<Alumno[]> {
   this.httpClient.post<Alumno[]>(`${enviroment.apiBaseUrl}/alumnos`,{...nuevoAlumno,fechaDeAlta: formatDate ( new Date(),'yyyy-MM-dd HH:mm','en')}).subscribe();
    this.estudiantes$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        this.estudiantes$.next([{...nuevoAlumno,fechaDeAlta: new Date()}, ...alumnos]);
      },
    });

    return this.estudiantes$.asObservable();
  }

  eliminarAlumno(alumnoAEliminar: Alumno) : Observable<Alumno[]>{
    this.httpClient.delete<Alumno[]>(`${enviroment.apiBaseUrl}/alumnos/${alumnoAEliminar.id}`).subscribe();
    this.estudiantes$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        const calumnosActualizados = alumnos.filter(
          (alumno) => alumno.id !== alumnoAEliminar.id
        );
        this.estudiantes$.next(calumnosActualizados);
      },
    });
    return this.estudiantes$.asObservable();
  }
  editarAlumno(
    alumnoId: number,
    actualizacion: Partial<Alumno>
  ): Observable<Alumno[]> {
    if (actualizacion.fechaDeAlta){
    this.httpClient.put<Alumno[]>(`${enviroment.apiBaseUrl}/alumnos/${alumnoId}`,{...actualizacion,fechaDeAlta: formatDate (actualizacion.fechaDeAlta,'yyyy-MM-dd HH:mm','en')}).subscribe();
    }
    this.estudiantes$.pipe(take(1)).subscribe({
      next: (alumnos) => {
        const alumnoActualizados = alumnos.map((alumno) => {
          if (alumno.id === alumnoId) {
            return {
              ...alumno,
              ...actualizacion,
            };
          } else {
            return alumno;
          }
        });

        this.estudiantes$.next(alumnoActualizados);
      },
    });
    return this.estudiantes$.asObservable();
  }
}
