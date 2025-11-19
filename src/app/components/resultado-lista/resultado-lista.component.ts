import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'
import { resultadoService } from 'src/app/services/resultado.service';
import { Resultado } from 'src/app/models/Resultado';
import { NotExpr } from '@angular/compiler';

@Component({
  selector: 'app-resultado-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado-lista.component.html',
  styleUrls: ['./resultado-lista.component.scss']
})
export class ResultadoListaComponent {
  resultados: Resultado[] = []

  constructor(
    private resultado_service: resultadoService, 
    private router: Router
  ){}
  
      ngOnInit(): void {
          this.resultado_service.getAllResultado().subscribe({
          next: (data: Resultado[]) => {
          console.log('Resultado desde backend:', data);
          this.resultados = data;
        },
        error: (err) => {
          console.error('Error cargando resultados', err);
        }
      });
    }

    cargarResultados():void{
      this.resultado_service.getAllResultado().subscribe(
        {
            next: (data) => this.resultados = data, 
            error: (err) => console.error('Error desde el backend al listar resultados', err)
        }
      );
    }

    nuevoResultado(): void{
      this.router.navigate(['/resultados/nuevo']);
    }

    editarResultado(id:number):void{
      this.router.navigate(['resultados/editar', id]); 
    }

    eliminarResultado(id:number): void{
      if(!!id) return; 
      if(!confirm('¿Está seguro de eliminar este resultado?')) return; 

      this.resultado_service.eliminarResultado(id).subscribe({
            next:() => this.cargarResultados(), 
            error: (err) => console.error('Error eliminando resultado', err)    
        });
    }



}
