import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from '../../dashboard/pages/alumnos/alumnos.component';

@Pipe({
  name: 'nombreCompleto'
})
export class NombreCompletoPipe implements PipeTransform {

  transform(value: Alumno, ...args: unknown[]): unknown {
    return value.apellido + ', ' + value.nombre;
  }

}
