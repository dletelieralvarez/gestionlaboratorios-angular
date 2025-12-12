import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PortalLoginComponent } from './portal-login.component';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';

describe('PortalLoginComponent', () => {
  let component: PortalLoginComponent;
  let fixture: ComponentFixture<PortalLoginComponent>;
  let usuariosPortalServiceSpy: jasmine.SpyObj<UsuariosPortalService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UsuariosPortalService', [
      'login',
      'recuperarPassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PortalLoginComponent,       // componente standalone
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UsuariosPortalService, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalLoginComponent);
    component = fixture.componentInstance;

    usuariosPortalServiceSpy = TestBed.inject(
      UsuariosPortalService
    ) as jasmine.SpyObj<UsuariosPortalService>;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');

    localStorage.clear();
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('enviar() con formulario inválido marca los controles y no llama al servicio', () => {
    const markAllSpy = spyOn(component.form, 'markAllAsTouched');

    // form está vacío → inválido
    component.enviar();

    expect(markAllSpy).toHaveBeenCalled();
    expect(usuariosPortalServiceSpy.login).not.toHaveBeenCalled();
  });

  it('enviar() con datos correctos llama login, guarda datos y navega a /resultados', () => {
    component.form.patchValue({
      rut: '11111111',
      password: '1234',
    });

    const respMock: any = {
      mensaje: 'OK',
      data: {
        id: 10,
        rolId: 3,
        nombreRol: 'Paciente',
      },
    };

    usuariosPortalServiceSpy.login.and.returnValue(of(respMock as any));

    const setItemSpy = spyOn(localStorage, 'setItem');

    component.enviar();

    expect(usuariosPortalServiceSpy.login).toHaveBeenCalledWith({
      rut: '11111111',
      password: '1234',
    });
    expect(component.cargando).toBeFalse();
    expect(setItemSpy).toHaveBeenCalledTimes(3); // id, rolId, rol
    expect(navigateSpy).toHaveBeenCalledWith(['/resultados']);
  });

  it('enviar() cuando el servicio devuelve error guarda el mensaje y no navega', () => {
    component.form.patchValue({
      rut: '11111111',
      password: '1234',
    });

    usuariosPortalServiceSpy.login.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Credenciales inválidas' } }))
    );

    component.enviar();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Credenciales inválidas');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('irARegistro() navega a /portal/registro', () => {
    component.irARegistro();
    expect(navigateSpy).toHaveBeenCalledWith(['/portal/registro']);
  });

  it('irARecuperarPassword() navega a /portal/recuperar-password', () => {
    component.irARecuperarPassword();
    expect(navigateSpy).toHaveBeenCalledWith(['/portal/recuperar-password']);
  });

  it('recuperarPassword() sin rut muestra alerta y no llama al servicio', () => {
    component.form.patchValue({ rut: '', password: '' });

    const alertSpy = spyOn(window, 'alert');

    component.recuperarPassword();

    expect(component.cargando).toBeFalse();
    expect(alertSpy).toHaveBeenCalledWith('Debes ingresar tu RUT o email');
    expect(usuariosPortalServiceSpy.recuperarPassword).not.toHaveBeenCalled();
  });

  it('recuperarPassword() éxito llama al servicio y muestra la contraseña temporal', () => {
    component.form.patchValue({ rut: '11111111', password: '' });

    const alertSpy = spyOn(window, 'alert');

    const respMock: any = {
      mensaje: 'Se envió la contraseña temporal',
      data: {
        tempPassword: 'Abc123',
      },
    };

    usuariosPortalServiceSpy.recuperarPassword.and.returnValue(of(respMock as any));

    component.recuperarPassword();

    expect(usuariosPortalServiceSpy.recuperarPassword).toHaveBeenCalledWith({
      rutOrEmail: '11111111',
      tempPassword: '',
    });
    expect(component.cargando).toBeFalse();
    expect(alertSpy).toHaveBeenCalledWith(
      respMock.mensaje +
        '\n\n' +
        'Contraseña temporal : ' +
        respMock.data.tempPassword
    );
  });

  it('recuperarPassword() error guarda el mensaje de error y muestra alert', () => {
    component.form.patchValue({ rut: '11111111', password: '' });

    const alertSpy = spyOn(window, 'alert');

    usuariosPortalServiceSpy.recuperarPassword.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Error al solicitar recuperación de password' } }))
    );

    component.recuperarPassword();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al solicitar recuperación de password');
    expect(alertSpy).toHaveBeenCalledWith('Error al solicitar recuperación de password');
  });

  //TESTS EXTRA PARA MEJORAR BRANCHES 

  it('enviar() no llama al servicio si el formulario es válido pero ya está cargando', () => {
    component.form.patchValue({
      rut: '11111111',
      password: '1234',
    });

    component.cargando = true; // segunda condición del if

    const markAllSpy = spyOn(component.form, 'markAllAsTouched');

    component.enviar();

    expect(markAllSpy).toHaveBeenCalled();
    expect(usuariosPortalServiceSpy.login).not.toHaveBeenCalled();
  });

  it('enviar() no guarda nada en localStorage si resp.data es null', () => {
    component.form.patchValue({
      rut: '11111111',
      password: '1234',
    });

    const respMock: any = {
      mensaje: 'OK',
      data: null, // user inexistente
    };

    usuariosPortalServiceSpy.login.and.returnValue(of(respMock as any));

    const setItemSpy = spyOn(localStorage, 'setItem');

    component.enviar();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/resultados']);
  });

  it('enviar() setea mensaje de error por defecto cuando no viene err.error.mensaje', () => {
    component.form.patchValue({
      rut: '11111111',
      password: '1234',
    });

    usuariosPortalServiceSpy.login.and.returnValue(
      throwError(() => ({})) // sin error.mensaje
    );

    component.enviar();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg)
      .toBe('Ocurrió un problema al intentar iniciar sesión. Intenta nuevamente.');
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('recuperarPassword() sin tempPassword muestra solo el mensaje', () => {
    component.form.patchValue({ rut: '11111111', password: '' });

    const alertSpy = spyOn(window, 'alert');

    const respMock: any = {
      mensaje: 'Solicitud enviada',
      data: {
        tempPassword: null, // rama else del if (tempPassword)
      },
    };

    usuariosPortalServiceSpy.recuperarPassword.and.returnValue(of(respMock as any));

    component.recuperarPassword();

    expect(component.cargando).toBeFalse();
    expect(alertSpy).toHaveBeenCalledWith(respMock.mensaje);
  });

  it('recuperarPassword() error sin mensaje usa mensaje por defecto', () => {
    component.form.patchValue({ rut: '11111111', password: '' });

    const alertSpy = spyOn(window, 'alert');

    usuariosPortalServiceSpy.recuperarPassword.and.returnValue(
      throwError(() => ({})) // sin error.mensaje
    );

    component.recuperarPassword();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al solicitar recuperación de password');
    expect(alertSpy).toHaveBeenCalledWith('Error al solicitar recuperación de password');
  });
});
