import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogConfirmacionComponent } from 'src/app/shared/dialog/dialog-confirmacion/dialog-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { AbmCursosComponent } from './abm-cursos/abm-cursos.component';
import { CursosService } from './Services/cursos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/AuthService';
import { Usuario } from 'src/app/core/models';

export interface Curso {
  id: number;
  nombreCurso: string;
  fechaInicio: Date;
  fechaFin: Date;
}

/**
 * @title Lista de cursos
 */
@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements AfterViewInit {
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    'id',
    'nombreCurso',
    'fechaInicio',
    'fechaFin',
    'opcionesDelete',
    'opcionesEdit',
    'opcionesDetalle',
  ];
  cursosSuscription: Subscription | null = null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  authUser$: Observable<Usuario | null>;

  constructor(
    private matDialog: MatDialog,
    private cursosService: CursosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.obtenerUsuarioAutenticado();
  }

  ngOnDestroy(): void {
    this.cursosSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.cursosSuscription = this.cursosService.obtenerCurso().subscribe({
      next: (cursos) => {
        this.dataSource.data = cursos;
      },
    });
  }
  eliminar(cursoAEliminar: Curso): void {
    const dialogRef = this.matDialog.open(DialogConfirmacionComponent, {
      data: {
        message:
          'Está seguro que desea eliminar el registro del curso: ' +
          cursoAEliminar.nombreCurso +
          '?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.cursosService.eliminarCurso(cursoAEliminar);
      }
    });
  }
  editar(cursoAEditar: Curso): void {
    const dialog = this.matDialog.open(AbmCursosComponent, {
      data: {
        cursoAEditar,
      },
    });
    dialog.afterClosed().subscribe((valorDelFormulario) => {
      if (valorDelFormulario) {
        this.cursosService.editarCurso(cursoAEditar.id, valorDelFormulario);
      }
    });
  }

  agregarCurso(): void {
    const dialog = this.matDialog.open(AbmCursosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        this.cursosService.crearCurso(valor);
      }
    });
  }
  detalle(cursoId: number): void {
    this.router.navigate([cursoId], {
      relativeTo: this.activatedRoute,
    });
  }
}
