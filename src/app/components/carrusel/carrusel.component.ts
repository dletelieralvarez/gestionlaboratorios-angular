import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements OnInit, OnDestroy {

  imagenes: string[] = [
    'assets/img/principal/1.jpg',
    'assets/img/principal/2.jpg',
    'assets/img/principal/3.jpg',
    'assets/img/principal/4.jpg',
    'assets/img/principal/5.jpg',
    'assets/img/principal/6.jpg',
    'assets/img/principal/7.jpg',
    'assets/img/principal/8.jpg',
  ]; 

  indiceActual = 0; 
  private intervaloId: any; 

  ngOnInit(): void {
      /*cambia imagen cada 5 segundos*/
      this.intervaloId = setInterval(()=> this.siguiente(), 5000); 
  }

  ngOnDestroy(): void {
      if(this.intervaloId){
        clearInterval(this.intervaloId); 
      }
  }

  siguiente(): void{
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length; 
  }

  anterior(): void{
    this.indiceActual = 
    (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length; 
  }

  irA(index: number): void{
    this.indiceActual = index;
  }
}
