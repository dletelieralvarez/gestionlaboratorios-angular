import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';
import { PerfilUsuarioPortalDTO } from 'src/app/models/PerfilUsuarioPortalDTO';
import { ApiResponse } from 'src/app/models/ApiRespose';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router'; 

@Component({
  selector: 'app-portal-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portal-perfil.component.html',
  styleUrls: ['./portal-perfil.component.scss']
})
export class PortalPerfilComponent implements OnInit {
  cargando = false;
  okMsg = '';
  errorMsg = '';

  form = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
    //telefono: ['']
  });

  private usuarioId!: number;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosPortalService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const idStr = localStorage.getItem('id');     
    if (!idStr) {
      this.errorMsg = 'No se encontró el usuario en sesión.';
      return;
    }

    this.usuarioId = Number(idStr);
    this.cargarPerfil();
  }

  get nombres() { return this.form.get('nombres')!; }
  get apellidos() { return this.form.get('apellidos')!; }
  get email() { return this.form.get('email')!; }

  cargarPerfil(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.usuariosService.obtenerPerfil(this.usuarioId).subscribe({
      next: (resp: ApiResponse<PerfilUsuarioPortalDTO>) => {
        this.cargando = false;
        const perfil = resp.data;
        if (perfil) {
          this.form.patchValue({
            nombres: perfil.nombres,
            apellidos: perfil.apellidos,
            email: perfil.email
            //telefono: perfil.telefono ?? ''
          });
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error cargando perfil', err);
        this.errorMsg = err.error?.mensaje || 'Error al cargar el perfil';
      }
    });
  }

  guardar(): void {
    if (this.form.invalid || this.cargando) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.okMsg = '';
    this.errorMsg = '';

    const body: PerfilUsuarioPortalDTO = {
      id: this.usuarioId,
      ...this.form.value as any
    };

    this.usuariosService.actualizarPerfil(body).subscribe({
      next: (resp: ApiResponse<PerfilUsuarioPortalDTO>) => {
        this.cargando = false;
        this.okMsg = resp.mensaje || 'Perfil actualizado correctamente';
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error actualizando perfil', err);
        this.errorMsg = err.error?.mensaje || 'Error al actualizar el perfil';
      }
    });
  }

  volverAResultados(): void {
    this.router.navigate(['/portal/resultados']); 
  }
}
