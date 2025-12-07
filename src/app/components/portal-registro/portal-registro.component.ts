import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';

@Component({
    selector: 'app-portal-registro',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './portal-registro.component.html',
    styleUrls: ['./portal-registro.component.scss']
})
export class PortalRegistroComponent {

  form: FormGroup;
  cargando = false;
  errorMsg = '';
  okMsg = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosPortalService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      rut: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registrar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched(); 
    this.errorMsg = 'Por favor revisa los campos resaltados.';
    return;
  }

  this.cargando = true;
  this.errorMsg = '';
  this.okMsg = '';

  this.usuariosService.registrar(this.form.value).subscribe({
    next: (resp) => {
      this.cargando = false;
      if (resp.codigoEstado === 200 || resp.codigoEstado === 201) {
        this.okMsg = 'Usuario creado correctamente.';
        this.router.navigate(['portal/login']);
      } else {
        this.errorMsg = resp.mensaje || 'No se pudo registrar el usuario.';
      }
    },
    error: (err) => {
      this.cargando = false;
      console.error('Error registro', err);

      if (err.error?.mensaje) {
        this.errorMsg = err.error.mensaje;
      } else {
        this.errorMsg = 'Ocurrió un problema al registrar. Intente nuevamente';
      }
    }
  });
}
}