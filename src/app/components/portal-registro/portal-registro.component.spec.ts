import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { PortalRegistroComponent } from './portal-registro.component';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';
import { Router } from '@angular/router';

describe('PortalRegistroComponent', () => {
  let component: PortalRegistroComponent;
  let fixture: ComponentFixture<PortalRegistroComponent>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosPortalService>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UsuariosPortalService', ['registrar']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PortalRegistroComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuariosPortalService, useValue: serviceSpy },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortalRegistroComponent);
    component = fixture.componentInstance;
    usuariosServiceSpy = TestBed.inject(UsuariosPortalService) as jasmine.SpyObj<UsuariosPortalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<any>;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('registrar() no llama al servicio si el form es inválido', () => {
    component.form.patchValue({ rut: '' }); 

    component.registrar();

    expect(usuariosServiceSpy.registrar).not.toHaveBeenCalled();
    expect(component.errorMsg).toBe('Por favor revisa los campos resaltados.');
  });

  it('registrar() éxito con código 200', () => {
    component.form.patchValue({
      rut: '11111111',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'test@test.com',
      password: '123456'
    });

    usuariosServiceSpy.registrar.and.returnValue(of({
      codigoEstado: 200,
      mensaje: 'OK'
    } as any));

    component.registrar();

    expect(usuariosServiceSpy.registrar).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['portal/login']);
    expect(component.okMsg).toBe('Usuario creado correctamente.');
    expect(component.errorMsg).toBe('');
  });

  it('registrar() retorno error del backend', () => {
    usuariosServiceSpy.registrar.and.returnValue(of({
      codigoEstado: 400,
      mensaje: 'Error backend'
    } as any));

    component.form.patchValue({
      rut: '111',
      nombres: 'A',
      apellidos: 'B',
      email: 'xxxx@test.com',
      password: '123456'
    });

    component.registrar();

    expect(component.errorMsg).toBe('Error backend');
  });

  it('registrar() error inesperado', () => {
    usuariosServiceSpy.registrar.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    component.form.patchValue({
      rut: '111',
      nombres: 'A',
      apellidos: 'B',
      email: 'xxxx@test.com',
      password: '123456'
    });

    component.registrar();

    expect(component.errorMsg).toBe('Ocurrió un problema al registrar. Intente nuevamente');
  });
});
