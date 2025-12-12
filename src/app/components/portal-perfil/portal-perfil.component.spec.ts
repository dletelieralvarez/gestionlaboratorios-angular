import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PortalPerfilComponent } from './portal-perfil.component';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';

describe('PortalPerfilComponent', () => {
  let component: PortalPerfilComponent;
  let fixture: ComponentFixture<PortalPerfilComponent>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosPortalService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UsuariosPortalService', [
      'obtenerPerfil',
      'actualizarPerfil',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PortalPerfilComponent,   // componente standalone
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UsuariosPortalService, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalPerfilComponent);
    component = fixture.componentInstance;

    usuariosServiceSpy = TestBed.inject(
      UsuariosPortalService
    ) as jasmine.SpyObj<UsuariosPortalService>;

    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');

    localStorage.clear();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe exponer los getters nombres, apellidos y email', () => {
    const nombresControl   = component.nombres;
    const apellidosControl = component.apellidos;
    const emailControl     = component.email;

    expect(nombresControl).toBeTruthy();
    expect(apellidosControl).toBeTruthy();
    expect(emailControl).toBeTruthy();

    expect(nombresControl).toBe(component.form.get('nombres')!);
    expect(apellidosControl).toBe(component.form.get('apellidos')!);
    expect(emailControl).toBe(component.form.get('email')!);
  });

  it('ngOnInit sin id en localStorage debe mostrar mensaje de error y NO llamar obtenerPerfil', () => {
    localStorage.removeItem('id'); // asegura que no haya id

    component.ngOnInit();

    expect(component.errorMsg).toBe('No se encontró el usuario en sesión.');
    expect(usuariosServiceSpy.obtenerPerfil).not.toHaveBeenCalled();
  });

  // rama contraria de ngOnInit (con id)
  it('ngOnInit con id en localStorage debe setear usuarioId y llamar cargarPerfil', () => {
    localStorage.setItem('id', '10');

    const cargarSpy = spyOn(component, 'cargarPerfil');

    component.ngOnInit();

    expect((component as any).usuarioId).toBe(10);
    expect(cargarSpy).toHaveBeenCalled();
  });

  it('cargarPerfil() éxito: carga datos en el formulario', () => {
    (component as any).usuarioId = 10;

    const perfilMock: any = {
      id: 10,
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@test.com',
    };

    const respMock: any = {
      data: perfilMock,
      mensaje: 'OK',
    };

    usuariosServiceSpy.obtenerPerfil.and.returnValue(of(respMock));

    component.cargarPerfil();

    expect(usuariosServiceSpy.obtenerPerfil).toHaveBeenCalledWith(10);
    expect(component.cargando).toBeFalse();
    expect(component.form.value).toEqual({
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@test.com',
    });
    expect(component.errorMsg).toBe('');
  });

  it('cargarPerfil() error: setea errorMsg y deja okMsg vacío', () => {
    (component as any).usuarioId = 10;

    usuariosServiceSpy.obtenerPerfil.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Error al cargar el perfil' } }))
    );

    component.cargarPerfil();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al cargar el perfil');
    expect(component.okMsg).toBe('');
  });

  // error sin mensaje (derecha del || en cargarPerfil)
  it('cargarPerfil() error sin mensaje usa mensaje por defecto y deja okMsg vacío', () => {
    (component as any).usuarioId = 10;

    usuariosServiceSpy.obtenerPerfil.and.returnValue(
      throwError(() => ({})) // sin error.mensaje
    );

    component.cargarPerfil();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al cargar el perfil');
    expect(component.okMsg).toBe('');
  });

  it('guardar() con formulario inválido marca los controles y NO llama actualizarPerfil', () => {
    const markAllSpy = spyOn(component.form, 'markAllAsTouched');

    component.form.patchValue({
      nombres: '',       // inválido
      apellidos: '',     // inválido
      email: 'mal',      // inválido
    });

    component.cargando = false;

    component.guardar();

    expect(markAllSpy).toHaveBeenCalled();
    expect(usuariosServiceSpy.actualizarPerfil).not.toHaveBeenCalled();
  });

  it('guardar() éxito: llama actualizarPerfil y setea okMsg con el mensaje del backend', () => {
    (component as any).usuarioId = 5;

    component.form.patchValue({
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    });

    const respMock: any = {
      mensaje: 'Perfil actualizado',
      data: {
        id: 5,
        nombres: 'Ana',
        apellidos: 'García',
        email: 'ana@test.com',
      },
    };

    usuariosServiceSpy.actualizarPerfil.and.returnValue(of(respMock));

    component.guardar();

    expect(usuariosServiceSpy.actualizarPerfil).toHaveBeenCalledWith({
      id: 5,
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    } as any);

    expect(component.cargando).toBeFalse();
    expect(component.okMsg).toBe('Perfil actualizado');
    expect(component.errorMsg).toBe('');
  });

  it('guardar() éxito sin mensaje usa el mensaje por defecto', () => {
    (component as any).usuarioId = 5;

    component.form.patchValue({
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    });

    const respMock: any = {
      // sin mensaje: debe usar 'Perfil actualizado correctamente'
      data: {
        id: 5,
        nombres: 'Ana',
        apellidos: 'García',
        email: 'ana@test.com',
      },
    };

    usuariosServiceSpy.actualizarPerfil.and.returnValue(of(respMock));

    component.guardar();

    expect(component.cargando).toBeFalse();
    expect(component.okMsg).toBe('Perfil actualizado correctamente');
    expect(component.errorMsg).toBe('');
  });

  it('guardar() error: setea errorMsg y no okMsg', () => {
    (component as any).usuarioId = 5;

    component.form.patchValue({
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    });

    usuariosServiceSpy.actualizarPerfil.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Error al actualizar el perfil' } }))
    );

    component.guardar();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al actualizar el perfil');
    expect(component.okMsg).toBe('');
  });

  // form válido pero cargando = true (segunda parte del OR en guardar)
  it('guardar() no llama al servicio si el formulario es válido pero ya está cargando', () => {
    component.form.patchValue({
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    });

    component.cargando = true;

    const markAllSpy = spyOn(component.form, 'markAllAsTouched');

    component.guardar();

    expect(markAllSpy).toHaveBeenCalled();
    expect(usuariosServiceSpy.actualizarPerfil).not.toHaveBeenCalled();
  });

  // error sin mensaje (derecha del || en guardar)
  it('guardar() error sin mensaje usa mensaje por defecto y limpia okMsg', () => {
    (component as any).usuarioId = 5;

    component.form.patchValue({
      nombres: 'Ana',
      apellidos: 'García',
      email: 'ana@test.com',
    });

    usuariosServiceSpy.actualizarPerfil.and.returnValue(
      throwError(() => ({})) // sin error.mensaje
    );

    component.guardar();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error al actualizar el perfil');
    expect(component.okMsg).toBe('');
  });

  it('volverAResultados() navega a /portal/resultados', () => {
    component.volverAResultados();
    expect(navigateSpy).toHaveBeenCalledWith(['/portal/resultados']);
  });
});
