import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PortalRecuperarPasswordComponent } from './portal-recuperar-password.component';
import { UsuariosPortalService } from 'src/app/services/usuarioPortal.service';

describe('PortalRecuperarPasswordComponent', () => {
  let component: PortalRecuperarPasswordComponent;
  let fixture: ComponentFixture<PortalRecuperarPasswordComponent>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosPortalService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UsuariosPortalService', [
      'recuperarPassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PortalRecuperarPasswordComponent, // standalone
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UsuariosPortalService, useValue: serviceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PortalRecuperarPasswordComponent);
    component = fixture.componentInstance;
    usuariosServiceSpy = TestBed.inject(
      UsuariosPortalService
    ) as jasmine.SpyObj<UsuariosPortalService>;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('enviar() no debe llamar al servicio si el formulario es inválido', () => {
    component.form.patchValue({ rutOrEmail: '' }); // requerido, queda inválido

    component.enviar();

    expect(usuariosServiceSpy.recuperarPassword).not.toHaveBeenCalled();
  });

  it('enviar() éxito: llama al servicio y setea okMsg', () => {
    component.form.patchValue({ rutOrEmail: '11111111' });

    const respMock = {
      mensaje: 'Correo enviado',
      data: { tempPassword: 'ABC123' },
      // otros campos que pueda tener ApiResponse no son relevantes aquí
    };

    usuariosServiceSpy.recuperarPassword.and.returnValue(of(respMock as any));

    component.enviar();

    expect(usuariosServiceSpy.recuperarPassword)
      .toHaveBeenCalledWith(component.form.value);

    expect(component.cargando).toBeFalse();
    expect(component.okMsg).toBe('Correo enviado');
    expect(component.errorMsg).toBe('');
  });

  it('enviar() error: setea errorMsg y no okMsg', () => {
    component.form.patchValue({ rutOrEmail: '11111111' });

    usuariosServiceSpy.recuperarPassword.and.returnValue(
      throwError(() => ({ error: { mensaje: 'Error recuperar password' } }))
    );

    component.enviar();

    expect(component.cargando).toBeFalse();
    expect(component.errorMsg).toBe('Error recuperar password');
    expect(component.okMsg).toBe('');
  });
});
