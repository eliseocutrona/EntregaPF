import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Curso } from '../cursos/cursos.component';
import { CursosService } from '../cursos/Services/cursos.service';
import { Alumno } from '../alumnos/alumnos.component';
import { AlumnosService } from '../alumnos/Services/alumnos.service';
import { InscripcionService } from './Services/inscripcion.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmacionComponent } from 'src/app/shared/dialog/dialog-confirmacion/dialog-confirmacion.component';

export interface Inscripcion {
  id: number;
  idCurso: number;
  nombreCurso: string;
  fechaInicioCurso: Date;
  fechaFinCurso: Date;
  nombreAlumno: string;
  apellidoAlumno: string;
  emailAlumno: string;
  numeroDocumentoAlumno: number;
}

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.scss'],
})
export class InscripcionesComponent {
  dataSourceInscripcion = new MatTableDataSource();

  displayedColumns: string[] = [
    'nombreCurso',
    'fechaInicioCurso',
    'fechaFinCurso',
    'nombreCompleto',
    'email',
    'numeroDocumento',
    'opcionesDelete',
  ];

  inscripcionSuscription: Subscription | null = null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInscripcion.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSourceInscripcion.paginator = this.paginator;
  }
  inscripcionControl = new FormControl('');
  idCursoInsc: number | null = null;
  idAlumnoInsc: number | null = null;
  nombreCursoControl = new FormControl('', [Validators.required]);
  nombreAlumnoControl = new FormControl('', [Validators.required]);

  inscripcionesForms = new FormGroup({
    nombreCurso: this.nombreCursoControl,
    nombreAlumno: this.nombreAlumnoControl,
  });
  cursos: Curso[] = [];
  alumnos: Alumno[] = [];

  dataSourceCurso = new MatTableDataSource<Curso>();
  dataSourceAlumno = new MatTableDataSource<Alumno>();
  constructor(
    private cursoService: CursosService,
    private alumnoService: AlumnosService,
    private inscripcionService: InscripcionService,
    private matDialog: MatDialog
  ) {
    this.cursoService.obtenerCurso().subscribe((curso) => {
      this.dataSourceCurso.data = curso;
    });

    this.alumnoService.obtenerAlumnos().subscribe((alumno) => {
      this.dataSourceAlumno.data = alumno;
    });
  }
  ngOnDestroy(): void {
    this.inscripcionSuscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.inscripcionSuscription = this.inscripcionService
      .obtenerInscripcion()
      .subscribe({
        next: (inscripciones) => {
          this.dataSourceInscripcion.data = inscripciones;
        },
      });

      
  }

  guardarCurso(cursoSeleccionado: Curso): void {
    this.idCursoInsc = cursoSeleccionado.id;
  }

  guardarAlumno(alumnoSeleccionado: Alumno): void {
    this.idAlumnoInsc = alumnoSeleccionado.id;
  }
  cursolog: any;
  alumnolog: any;
  nuevaInscripcion: any;
  asignarCurso(): void {
    if (this.idCursoInsc && this.idAlumnoInsc) {
      this.cursoService
        .obtenerCursoPorId(this.idCursoInsc)
        .subscribe((inscripciones) => {
          this.cursolog = inscripciones;
        });

      this.alumnoService
        .obtenerAlumnoPorId(this.idAlumnoInsc)
        .subscribe((inscripciones) => {
          this.alumnolog = inscripciones;
        });

      this.nuevaInscripcion = {
        idCurso: this.idCursoInsc,
        nombreCurso: this.cursolog.nombreCurso,
        fechaInicioCurso: this.cursolog.fechaInicio,
        fechaFinCurso: this.cursolog.fechaFin,
        nombreAlumno: this.alumnolog.nombre,
        apellidoAlumno: this.alumnolog.apellido,
        emailAlumno: this.alumnolog.email,
        numeroDocumentoAlumno: this.alumnolog.numeroDocumento,
      };
      this.inscripcionService.inscribirAlumno(this.nuevaInscripcion);
    }
  }
  eliminar(alumnoAEliminar: Inscripcion): void {
    const dialogRef = this.matDialog.open(DialogConfirmacionComponent, {
      data: {
        message:
          'Está seguro que desea eliminar el registro del empleado: ' +
          alumnoAEliminar.apellidoAlumno +
          ', ' +
          alumnoAEliminar.nombreAlumno +
          '?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.inscripcionService.eliminarInscripcion(alumnoAEliminar);
      }
    });
  }
}
