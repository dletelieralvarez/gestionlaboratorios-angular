import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { resultadoService } from 'src/app/services/resultado.service';
import { Resultado } from 'src/app/models/Resultado';
import { TipoAnalisis } from 'src/app/models/TipoAnalisis';
import { EstadoResultado } from 'src/app/models/EstadoResultado';

@Component({
    selector: 'app-resultado-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './resultado-form.component.html',
    styleUrls: ['./resultado-form.component.scss']
})
export class ResultadoFormComponent implements OnInit {
  form!: FormGroup; 
  id?:number; // en caso que el id no venga, se crea el registro
  titulo = 'Nuevo Resultado'; 

  tipoAnalisis = Object.values(TipoAnalisis); 
  estados = Object.values(EstadoResultado); 

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private resultado_service: resultadoService
  ){}

  ngOnInit(): void {
      /*formulario para nuevo resultado*/

      this.id = Number(this.route.snapshot.paramMap.get('id')) || undefined; 

      this.form = this.fb.group({
        usuarioId: [null, Validators.required], 
        tipo:[null, Validators.required], 
        idLaboratorio:[null, Validators.required],
        valores:['', Validators.required], 
        fechaMuestra:['', Validators.required],
        /*fecha de resultado no se toca ya que teniendo la fecha de muestra se la suman 3 dias*/ 
        fechaResultado:[{value:null, disabled:true}], 
        /*comienza En Proceso*/
        estado:[{value: EstadoResultado.En_Proceso, disabled:true}],
        creado:[null],
        actualizado:[null]
      });

      // 2. Si es nuevo, seteo "creado"
    this.form.patchValue({ creado: new Date() });

    // 3. Calcular fechaResultado al cambiar fechaMuestra
    this.form.get('fechaMuestra')!.valueChanges.subscribe(value => {
      if (!value) {
        this.form.patchValue({ fechaResultado: null }, { emitEvent: false });
        return;
      }

      const fecha = new Date(value);
      const fechaResultado = new Date(fecha);
      fechaResultado.setDate(fechaResultado.getDate() + 3);

      const iso = fechaResultado.toISOString().substring(0, 10);
      this.form.patchValue({ fechaResultado: iso }, { emitEvent: false });
    });

    // 4. Leo el id de la ruta,solo una vez y cargo si existe
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.titulo = 'Editar Resultado';
        this.cargarResultado(this.id);
      }
    });
  }

  private cargarResultado(id:number): void{
    this.resultado_service.getResultadoById(id).subscribe({
      next: (resultado: Resultado) => {
        /*llena el formulario con los datos*/
        this.form.patchValue(
          {
            usuarioId: resultado.usuarioId,
            tipo: resultado.tipo,
            idLaboratorio: resultado.idLaboratorio,
            valores: resultado.valores,
            fechaMuestra: resultado.fechaMuestra,
            fechaResultado: resultado.fechaResultado,
            estado: resultado.estado,
            creado: resultado.creado,
            actualizado: resultado.actualizado
          }); 

          this.form.get('usuarioId')!.disable();
          this.form.get('tipo')!.disable();
          this.form.get('idLaboratorio')!.disable();
          this.form.get('valores')!.disable();
          this.form.get('fechaMuestra')!.disable();
          this.form.get('fechaResultado')!.disable();
          this.form.get('estado')!.enable();          
      }, 
      error: err =>{
        console.error('Error cargando resultado', err); 
      }
    });
  }

  /*guardar nuevo resultado*/
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // Convierte usuarioId (number) en usuario { id: number }
    // const payload: any = {
    //   ...raw,
    //   usuario: { id: raw.usuarioId }
    // };
    const payload = this.form.getRawValue();

    //delete payload.usuarioId;

    if (this.id) {
      this.resultado_service.actualizarResultado(this.id, payload).subscribe({
        next: () => this.volverALaLista(),
        error: err => console.error('Error actualizando resultado', err)
      });
    } else {
      this.resultado_service.crearResultado(payload).subscribe({
        next: () => this.volverALaLista(),
        error: err => console.error('Error guardando resultado', err)
      });
    }
  }

  cancelar(): void {
    this.volverALaLista();
  }

  volverALaLista(): void{
    this.router.navigate(['/resultados']); 
  }

}
