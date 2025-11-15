import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private resultado_service: resultadoService){}
  
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
}
