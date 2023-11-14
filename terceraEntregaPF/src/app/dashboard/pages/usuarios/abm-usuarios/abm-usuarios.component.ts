import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-usuarios',
  templateUrl: './abm-usuarios.component.html',
  styleUrls: ['./abm-usuarios.component.scss']
})
export class AbmUsuariosComponent implements OnInit {
  nombreControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
  ]);
  apellidoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
  ]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);

  roleControl = new FormControl('', [
    Validators.required,]);

  passwordControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(14),
      Validators.minLength(8),]);

  usuariosForms = new FormGroup({
    nombre: this.nombreControl,
    apellido: this.apellidoControl,
    email: this.emailControl,
    role: this.roleControl,
    password: this.passwordControl,
  });
  selected :any;
  constructor(
    private dialogRef: MatDialogRef<AbmUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.nombreControl.setValue(data.usuarioAEditar.nombre );
      this.apellidoControl.setValue(data.usuarioAEditar.apellido);
      this.emailControl.setValue(data.usuarioAEditar.email);
      this.roleControl.setValue(data.usuarioAEditar.role);
      this.passwordControl.setValue(data.usuarioAEditar.password); 
      this.selected = data.usuarioAEditar.role;     
    }
  
  }

  guardar(): void {
    if (this.usuariosForms.valid) {
      this.dialogRef.close(this.usuariosForms.value);
    } else {
      this.usuariosForms.markAllAsTouched();
    }
  }

  ngOnInit() {
    
  }
}
