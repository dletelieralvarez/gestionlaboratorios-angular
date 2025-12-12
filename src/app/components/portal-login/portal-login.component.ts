import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';
import { LoginUsuarioPortalDTO } from 'src/app/models/UsuarioPortal';

@Component({
    selector: 'app-portal-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './portal-login.component.html',
    styleUrls: ['./portal-login.component.scss']
})
export class PortalLoginComponent {
cargando = false;
  errorMsg: string | null = null;

  form = this.fb.group({
    rut: ['', [Validators.required, Validators.minLength(7)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private fb: FormBuilder,
    private usuariosPortalService: UsuariosPortalService,
    private router: Router
  ) {}

  get rut() { return this.form.get('rut'); }
  get password() { return this.form.get('password'); }

  enviar(): void {
    if (this.form.invalid || this.cargando) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMsg = null;

    const body: LoginUsuarioPortalDTO = this.form.value as LoginUsuarioPortalDTO;

    this.usuariosPortalService.login(body).subscribe({
      next: resp => {        
        console.log('Login OK', resp.data);
        
        //guardare en localstorage
        const user = resp.data;
        if (user) {
          localStorage.setItem('id', String(user.id));            
          localStorage.setItem('rolId', String(user.rolId));      
          localStorage.setItem('rol', user.nombreRol || ''); 
        }

        this.cargando = false;

        this.router.navigate(['/resultados']);
      },
      error: err => {
        console.error('Error login', err);
        this.cargando = false;

        this.errorMsg =
          err?.error?.mensaje ||
          'Ocurrió un problema al intentar iniciar sesión. Intenta nuevamente.';
      }
    });
  }

  irARegistro(): void {    
    this.router.navigate(['/portal/registro']);
  }

  irARecuperarPassword(): void {
    this.router.navigate(['/portal/recuperar-password']);
  }

  recuperarPassword(): void {
    this.cargando = true;
    this.errorMsg = '';
    const rutOrEmail = this.form.value.rut;

  if (!rutOrEmail) {
    this.cargando = false;
    alert('Debes ingresar tu RUT o email');
    return;
  }


  this.usuariosPortalService.recuperarPassword({ rutOrEmail , tempPassword: ''}).subscribe({
    next: (resp) => {
    this.cargando = false;

    const tempPassword = resp.data?.tempPassword;

    if (tempPassword) {
      alert(
        resp.mensaje + '\n\n' +
        'Contraseña temporal : ' + tempPassword
      );
    } else {
      alert(resp.mensaje);
    }
  },
  error: (err) => {
    this.cargando = false;
    console.error('Error recuperar password', err);
    this.errorMsg = err.error?.mensaje || 'Error al solicitar recuperación de password';
    alert(this.errorMsg);
    }
  });
  }
}