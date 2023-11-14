import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InscripcionService } from '../../inscripciones/Services/inscripcion.service';
import { CursosService } from '../Services/cursos.service';
import { Curso } from '../cursos.component';
import { Inscripcion } from '../../inscripciones/inscripciones.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacionComponent } from 'src/app/shared/dialog/dialog-confirmacion/dialog-confirmacion.component';

@Component({
  selector: 'app-detalleCursos',
  templateUrl: './detalleCursos.component.html',
  styleUrls: ['./detalleCursos.component.scss'],
})
export class DetalleCursosComponent {
  displayedColumns: string[] = [
    'nombreAlumno',
    'emailAlumno',
    'numeroDocumento',
    'opcionesDelete',
  ];
  curso: Curso | undefined;
  dataSource = new MatTableDataSource<Inscripcion>();
  private destroyed$ = new Subject();
  inscripcionSuscription: Subscription | null = null;
  nombreCursoControl = new FormControl();

  cursosDetalleForms = new FormGroup({
    nombreCurso: this.nombreCursoControl,
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private cursosService: CursosService,
    private inscripcionService: InscripcionService,
    private matDialog: MatDialog
  ) {
    this.cursosService
      .obtenerCursoPorId(parseInt(this.activatedRoute.snapshot.params['id']))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((curso) => (this.curso = curso));
    if (this.curso) {
      this.nombreCursoControl.setValue(this.curso?.nombreCurso);
      this.inscripcionService
        .obtenerAlumnosPorCurso(this.curso.id)
        .subscribe((inscripciones) => {
          this.dataSource.data = inscripciones;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.inscripcionSuscription?.unsubscribe();
  }
  ngOnInit(): void {}
  eliminar(alumnoAEliminar: Inscripcion): void {
    const dialogRef = this.matDialog.open(DialogConfirmacionComponent, {
      data: {
        message:
          'Está seguro que desea dar de baja al alumno: ' +
          alumnoAEliminar.apellidoAlumno +
          ', ' +
          alumnoAEliminar.nombreAlumno +
          '?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.inscripcionService.eliminarInscripcionAlumno(alumnoAEliminar);
      }
    });
  }
}
