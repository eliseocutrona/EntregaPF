import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Usuario } from 'src/app/core/models';
import { UsuarioService } from '../Service/usuario.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-usuarios',
  templateUrl: './detalle-usuarios.component.html',
  styleUrls: ['./detalle-usuarios.component.scss']
})
export class DetalleUsuariosComponent  implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'apellido',
    'email',
    'password',
    'role'
  ];
  dataSource = new MatTableDataSource<Usuario>();

  usuario: Usuario | undefined;
  //inscripcion: any;
  usuarioSuscription: Subscription | null = null;
  private destroyed$ = new Subject();

  nombreControl = new FormControl();
  apellidoControl = new FormControl();
  emailControl = new FormControl();
  passwordControl = new FormControl();
  roleControl = new FormControl();

  usuariosDetalleForms = new FormGroup({
    nombre: this.nombreControl,
    apellido: this.apellidoControl,
    email: this.emailControl,
    password: this.passwordControl,
    role: this.roleControl,
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private usuariosService: UsuarioService,
    private matDialog: MatDialog
  ) {
    this.usuariosService
    .obtenerUsuarioPorId(
      parseInt(this.activatedRoute.snapshot.params['id'])
    )
    .pipe(takeUntil(this.destroyed$))
    .subscribe((usuario) => (this.usuario = usuario));
  this.nombreControl.setValue(this.usuario?.nombre);
  this.apellidoControl.setValue(this.usuario?.apellido);
  this.emailControl.setValue(this.usuario?.email);
  this.passwordControl.setValue(this.usuario?.password);
  this.roleControl.setValue(this.usuario?.role);    
  }

  ngOnDestroy(): void {
   this.destroyed$.next(true);
   this.usuarioSuscription?.unsubscribe();
  }
   ngOnInit(): void {
    // this.inscripcionSuscription = this.inscripcionService.obtenerAlumnosPorCurso(parseInt(this.activatedRoute.snapshot.params['id'])).subscribe({
    //   next: (cursos) => {
    //     this.dataSource.data = cursos;
    //   },
    // });     
  }

}
