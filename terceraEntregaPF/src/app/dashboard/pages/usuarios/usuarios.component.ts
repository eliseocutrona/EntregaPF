import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsuarioService } from './Service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbmUsuariosComponent } from './abm-usuarios/abm-usuarios.component';
import { Usuario } from 'src/app/core/models';
import { DialogConfirmacionComponent } from 'src/app/shared/dialog/dialog-confirmacion/dialog-confirmacion.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements AfterViewInit {
  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    'nombre',
    //'apellido',
    'email',
    'role',
    'opcionesDelete',
    'opcionesEdit',
    'opcionesDetalle',
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  usuariosSuscription: Subscription | null = null;

  constructor(
    private matDialog: MatDialog,
    private usuariosService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.usuariosSuscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.usuariosSuscription = this.usuariosService.obtenerUsuario().subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
      },
    });
    
  }
  abrirABMUsuarios(): void {
    const dialog = this.matDialog.open(AbmUsuariosComponent);
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        this.usuariosService.crearUsuario(valor);
      }
    });
  }

  eliminar(usaurioAEliminar: Usuario): void {
    usaurioAEliminar = { ...usaurioAEliminar };
    const dialogRef = this.matDialog.open(DialogConfirmacionComponent, {
      data: {
        message:
          'Está seguro que desea eliminar el registro del usuario: ' +
          usaurioAEliminar.apellido +
          ', ' +
          usaurioAEliminar.nombre +
          '?',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.usuariosService.eliminarUsuario(usaurioAEliminar);
      }
    });
  }

  editar(usuarioAEditar: Usuario): void {
    const dialog = this.matDialog.open(AbmUsuariosComponent, {
      data: {
        usuarioAEditar,
      },
    });
    dialog.afterClosed().subscribe((valorDelFormulario) => {
      if (valorDelFormulario) {
        this.usuariosService.editarUsuario(
          usuarioAEditar.id,
          valorDelFormulario
        );
      }
    });
  }
  detalle(usuarioId: number): void {
    this.router.navigate([usuarioId], {
      relativeTo: this.activatedRoute,
    });
  }
}
