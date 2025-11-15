import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rolService } from 'src/app/services/rol.service';
import { Rol } from 'src/app/models/Rol';
import { NotExpr } from '@angular/compiler';

@Component({
  selector: 'app-rol-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rol-lista.component.html',
  styleUrls: ['./rol-lista.component.scss']
})
export class RolListaComponent implements OnInit {

    roles: Rol[] = []; 

    constructor(private rol_Service: rolService){}

    ngOnInit(): void {
        this.rol_Service.getAllRoles().subscribe({
        next: (data: Rol[]) => {
        console.log('Roles desde backend:', data);
        this.roles = data;
      },
      error: (err) => {
        console.error('Error cargando roles', err);
      }
    });
}
}
