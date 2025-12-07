import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { rolService } from './rol.service';
import { environment } from 'src/environments/environments';
import { Rol } from '../models/Rol';
import { ApiResponse } from '../models/ApiRespose';

describe('rolService', () => {
  let service: rolService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/roles`;

  const rolMock: Rol = {
    id: 1,
    nombreRol: 'ADMIN'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [rolService]
    });

    service = TestBed.inject(rolService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden requests pendientes
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('getAllRoles debe hacer GET y mapear resp.data', () => {
    const respMock: ApiResponse<Rol[]> = {
      data: [rolMock],
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.getAllRoles().subscribe(roles => {
      expect(roles).toEqual([rolMock]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });

  it('getRolById debe hacer GET /roles/:id y devolver resp.data', () => {
    const respMock: ApiResponse<Rol> = {
      data: rolMock,
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.getRolById(1).subscribe(rol => {
      expect(rol).toEqual(rolMock);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });

  it('createRol debe hacer POST y devolver resp.data', () => {
    const nuevoRol: Omit<Rol, 'id'> = {
      nombreRol: 'CLIENTE'
    };

    const respMock: ApiResponse<Rol> = {
      data: { id: 2, nombreRol: 'CLIENTE' },
      mensaje: 'creado',
      codigoEstado: 201,
      links: []
    };

    service.createRol(nuevoRol).subscribe(rol => {
      expect(rol).toEqual(respMock.data);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoRol);

    req.flush(respMock);
  });

  it('updateRol debe hacer PUT /roles/:id y devolver resp.data', () => {
    const cambios: Partial<Rol> = { nombreRol: 'SUPER_ADMIN' };

    const respMock: ApiResponse<Rol> = {
      data: { id: 1, nombreRol: 'SUPER_ADMIN' },
      mensaje: 'actualizado',
      codigoEstado: 200,
      links: []
    };

    service.updateRol(1, cambios).subscribe(rol => {
      expect(rol).toEqual(respMock.data);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush(respMock);
  });

  it('deleteRol debe hacer DELETE /roles/:id y devolver resp.mensaje', () => {
    const respMock: ApiResponse<string> = {
      data: '' as any,
      mensaje: 'Rol eliminado correctamente',
      codigoEstado: 200,
      links: []
    };

    service.deleteRol(1).subscribe(msg => {
      expect(msg).toBe('Rol eliminado correctamente');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(respMock);
  });
});
