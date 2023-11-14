import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrls: ['./abm-alumnos.component.scss'],
})
export class AbmAlumnosComponent implements OnInit {
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
  numeroDocumentoControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(2),
    Validators.pattern(/^[0-9]\d*$/),
  ]);

  alumnosForms = new FormGroup({
    nombre: this.nombreControl,
    apellido: this.apellidoControl,
    email: this.emailControl,
    numeroDocumento: this.numeroDocumentoControl,
  });
  constructor(
    private dialogRef: MatDialogRef<AbmAlumnosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.nombreControl.setValue(data.alumnoAEditar.nombre);
      this.apellidoControl.setValue(data.alumnoAEditar.apellido);
      this.emailControl.setValue(data.alumnoAEditar.email);
      this.numeroDocumentoControl.setValue(data.alumnoAEditar.numeroDocumento);
    }
  }

  guardar(): void {
    if (this.alumnosForms.valid) {
      this.dialogRef.close(this.alumnosForms.value);
    } else {
      this.alumnosForms.markAllAsTouched();
    }
  }

  ngOnInit() {
  }
}
