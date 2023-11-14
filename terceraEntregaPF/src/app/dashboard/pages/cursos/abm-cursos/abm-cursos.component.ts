import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-cursos',
  templateUrl: './abm-cursos.component.html',
  styleUrls: ['./abm-cursos.component.scss'],
})
export class AbmCursosComponent implements OnInit {
  nombreCursoControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
  ]);

  fechaInicioControl = new FormControl('', [Validators.required]);
  fechaFinControl = new FormControl('', [Validators.required]);

  cursosForms = new FormGroup({
    nombreCurso: this.nombreCursoControl,
    fechaInicio: this.fechaInicioControl,
    fechaFin: this.fechaFinControl,
  });
  
  constructor(
    private dialogRef: MatDialogRef<AbmCursosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.nombreCursoControl.setValue(data.cursoAEditar.nombreCurso);
      this.fechaInicioControl.setValue(data.cursoAEditar.fechaInicio);
      this.fechaFinControl.setValue(data.cursoAEditar.fechaFin);
    }
  }

  guardar(): void {
    if (this.cursosForms.valid) {
      this.dialogRef.close(this.cursosForms.value);
    } else {
      this.cursosForms.markAllAsTouched();
    }
  }

  ngOnInit() {
  }
}
