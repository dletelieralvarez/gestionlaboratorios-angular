import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';
import { ApiResponse } from 'src/app/models/ApiRespose';
import { RecuperarPassword } from 'src/app/models/RecuperarPassword';

@Component({
    selector: 'app-portal-recuperar-password',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './portal-recuperar-password.component.html',
    styleUrls: ['./portal-recuperar-password.component.scss']
})
export class PortalRecuperarPasswordComponent {
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
      rutOrEmail: ['', [Validators.required]]
    });
  }

  get rutOrEmail() {
    return this.form.get('rutOrEmail');
  }

  enviar() {
    if (this.form.invalid) return;

    this.cargando = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.usuariosService.recuperarPassword(this.form.value).subscribe({
      next: (resp: ApiResponse<RecuperarPassword>) => {
        this.cargando = false;
        this.okMsg = resp.mensaje || 'Si los datos son correctos, te enviaremos un correo con instrucciones.';
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error recuperar password', err);
        this.errorMsg = err.error?.mensaje || 'Ocurrió un problema al recuperar la contraseña.';
      }
    });
  }
}
