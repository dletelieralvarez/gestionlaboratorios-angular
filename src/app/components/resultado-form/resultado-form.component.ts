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
  standalone: true,
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

      /*si es una actualizacion cargo el resultado*/
      if(this.id){
        this.cargarResultado(this.id); 
      }else{
        this.form.patchValue({creado: new Date()}); 
      }

      /*cada vez que cambie fecha de muestra calculará la fecha de resultado*/
      this.form.get('fechaMuestra')!.valueChanges.subscribe(value => { 
            if(!value){
              this.form.patchValue({ fechaResultado: null }, { emitEvent: false}); 
              return;
            }
            
            const fecha = new Date(value); 
            const fechaResultado = new Date(fecha); 
            fechaResultado.setDate(fechaResultado.getDate() + 3); 

            //formato a la fecha
            const iso = fechaResultado.toISOString().substring(0,10); 

            this.form.patchValue(
              { fechaResultado: iso},
              { emitEvent: false}
            );
        }); 

      /*aqui veo si viene el id en la ruta*/
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id'); 
        if(idParam){
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
            tipo:resultado.tipo, 
            idLaboratorio:resultado.idLaboratorio,
            valores:resultado.valores, 
            fechaMuestra:resultado.fechaMuestra, 
            fechaResultado:resultado.fechaResultado, 
            estado:resultado.estado,
            creado: resultado.creado, 
            actualizado: resultado.actualizado
          }); 

          this.form.get('estado')!.enable(); 
      }, 
      error: err =>{
        console.error('Error cargando resultado', err); 
      }
    });
  }

  /*guardar nuevo resultado*/
  guardar():void{

    if(this.form.invalid){
      this.form.markAllAsTouched(); 
      return; 
    }

    const datos: Resultado = this.form.getRawValue(); 
    const valoresForm = this.form.value as Resultado; 

    /*si viene el id, editara sino crea el resultado*/
    if(this.id){
      this.resultado_service.actualizarResultado(this.id, datos).subscribe({
        next: () => this.volverALaLista(),
        error: err => console.error('Error actualizando resultado', err)
      });
    }else{
      this.resultado_service.crearResultado(datos).subscribe({
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
