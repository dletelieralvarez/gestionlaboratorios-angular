import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { UsuariosPortalService } from './usuarioPortal.service';
import { environment } from 'src/environments/environments';
import { ApiResponse } from '../models/ApiRespose';
import {
  LoginUsuarioPortalDTO,
  UsuarioPortalDTO
} from '../models/UsuarioPortal';
import { RegistroUsuarioPortal } from '../models/RegistroUsuarioPortal';
import { RecuperarPassword } from '../models/RecuperarPassword';
import { PerfilUsuarioPortalDTO } from '../models/PerfilUsuarioPortalDTO';

describe('UsuariosPortalService', () => {
  let service: UsuariosPortalService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/api/portal`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosPortalService]
    });

    service = TestBed.inject(UsuariosPortalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('login debe hacer POST a /login y devolver ApiResponse<UsuarioPortalDTO>', () => {
    const body: LoginUsuarioPortalDTO = {
      rut: '12345678-9',
      password: 'secreto'
    };

    const respMock: ApiResponse<UsuarioPortalDTO> = {
      data: {
        id: 10,
        rolId: 3,
        nombreRol: 'Paciente',
      } as UsuarioPortalDTO,
      mensaje: 'Login OK',
      codigoEstado: 200,
      links: []
    };

    service.login(body).subscribe(resp => {
      expect(resp).toEqual(respMock);
      expect(resp.data.id).toBe(10);
      expect(resp.data.rolId).toBe(3);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(respMock);
  });

  it('registrar debe hacer POST a /usuarios/registro', () => {
    const body: RegistroUsuarioPortal = {
      rut: '12345678-9',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@test.com',
      password: 'secreto123'
    };

    const respMock: ApiResponse<UsuarioPortalDTO> = {
      data: {
        id: 11,
        rolId: 3,
        nombreRol: 'Paciente'
      } as UsuarioPortalDTO,
      mensaje: 'Usuario registrado',
      codigoEstado: 201,
      links: []
    };

    service.registrar(body).subscribe(resp => {
      expect(resp).toEqual(respMock);
      expect(resp.data.id).toBe(11);
    });

    const req = httpMock.expectOne(`${apiUrl}/usuarios/registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(respMock);
  });

  it('recuperarPassword debe hacer POST a /usuarios/recuperar-password', () => {
    const body: RecuperarPassword = {
      rutOrEmail: '12345678-9',
      tempPassword: ''
    };

    const respMock: ApiResponse<RecuperarPassword> = {
      data: {
        rutOrEmail: body.rutOrEmail,
        tempPassword: 'TEMP-1234'
      },
      mensaje: 'Password temporal generada',
      codigoEstado: 200,
      links: []
    };

    service.recuperarPassword(body).subscribe(resp => {
      expect(resp).toEqual(respMock);
      expect(resp.data.tempPassword).toBe('TEMP-1234');
    });

    const req = httpMock.expectOne(`${apiUrl}/usuarios/recuperar-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(respMock);
  });

  it('obtenerPerfil debe hacer GET a /usuarios/perfil/:id', () => {
    const perfilMock: PerfilUsuarioPortalDTO = {
      id: 5,
      nombres: 'María',
      apellidos: 'González',
      email: 'maria@test.com'
    };

    const respMock: ApiResponse<PerfilUsuarioPortalDTO> = {
      data: perfilMock,
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.obtenerPerfil(5).subscribe(resp => {
      expect(resp).toEqual(respMock);
      expect(resp.data.id).toBe(5);
    });

    const req = httpMock.expectOne(`${apiUrl}/usuarios/perfil/5`);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });

  it('actualizarPerfil debe hacer PUT a /usuarios/perfil/:id', () => {
    const perfil: PerfilUsuarioPortalDTO = {
      id: 7,
      nombres: 'Pedro',
      apellidos: 'López',
      email: 'pedro@test.com'
    };

    const respMock: ApiResponse<PerfilUsuarioPortalDTO> = {
      data: perfil,
      mensaje: 'Perfil actualizado',
      codigoEstado: 200,
      links: []
    };

    service.actualizarPerfil(perfil).subscribe(resp => {
      expect(resp).toEqual(respMock);
      expect(resp.data.id).toBe(7);
      expect(resp.data.nombres).toBe('Pedro');
    });

    const req = httpMock.expectOne(`${apiUrl}/usuarios/perfil/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(perfil);

    req.flush(respMock);
  });
});
