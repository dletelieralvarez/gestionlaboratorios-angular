import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { resultadoService } from './resultado.service';
import { environment } from 'src/environments/environments';
import { ApiResponse } from '../models/ApiRespose';
import { Resultado } from '../models/Resultado';

describe('resultadoService', () => {
  let service: resultadoService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/api/resultados`;

  const resultadoMock: Resultado = {
    id: 1,
    usuarioId: 10,
    tipo: 'SANGRE' as any,
    idLaboratorio: 2,
    valores: 'OK',
    fechaMuestra: '2025-01-01',
    fechaResultado: '2025-01-04',
    estado: 'EN_PROCESO' as any,
    creado: new Date('2025-01-01'),
    actualizado: new Date('2025-01-02')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [resultadoService]
    });

    service = TestBed.inject(resultadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('getAllResultado debe llamar a GET /api/resultados y devolver el ApiResponse', () => {
    const respMock: ApiResponse<Resultado[]> = {
      data: [resultadoMock],
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.getAllResultado().subscribe(resp => {
      expect(resp).toEqual(respMock);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });

  it('getResultadoById debe llamar a GET /api/resultados/:id y mapear resp.data', () => {
    const respMock: ApiResponse<Resultado> = {
      data: resultadoMock,
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.getResultadoById(1).subscribe(resultado => {
      expect(resultado).toEqual(resultadoMock);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });

  it('crearResultado debe llamar a POST y devolver resp.data', () => {
    const respMock: ApiResponse<Resultado> = {
      data: resultadoMock,
      mensaje: 'creado',
      codigoEstado: 201,
      links: []
    };

    service.crearResultado(resultadoMock).subscribe(resultado => {
      expect(resultado).toEqual(resultadoMock);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(resultadoMock);

    req.flush(respMock);
  });

  it('actualizarResultado debe llamar a PUT y devolver el primer elemento de resp.data', () => {
    const actualizado: Resultado = { ...resultadoMock, valores: 'CAMBIADO' };

    const respMock: ApiResponse<Resultado[]> = {
      data: [actualizado],
      mensaje: 'actualizado',
      codigoEstado: 200,
      links: []
    };

    service.actualizarResultado(1, actualizado).subscribe(resultado => {
      expect(resultado).toEqual(actualizado);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(actualizado);

    req.flush(respMock);
  });

  it('eliminarResultado debe llamar a DELETE y mapear el mensaje', () => {
    const respMock: ApiResponse<string> = {
      data: '' as any,
      mensaje: 'eliminado ok',
      codigoEstado: 200,
      links: []
    };

    service.eliminarResultado(1).subscribe(msg => {
      expect(msg).toBe('eliminado ok');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(respMock);
  });

  it('buscarPorFiltros debe enviar los params correctos y devolver resp.data', () => {
    const lista: Resultado[] = [resultadoMock];

    const respMock: ApiResponse<Resultado[]> = {
      data: lista,
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.buscarPorFiltros(10, 2, '2025-01-01').subscribe(resultados => {
      expect(resultados).toEqual(lista);
    });

    const req = httpMock.expectOne(r =>
      r.url === `${apiUrl}/filtros`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('usuarioId')).toBe('10');
    expect(req.request.params.get('idLaboratorio')).toBe('2');
    expect(req.request.params.get('fechaMuestra')).toBe('2025-01-01');

    req.flush(respMock);
  });

  it('getResultadosPorUsuario debe llamar a GET /usuario/:id', () => {
    const respMock: ApiResponse<Resultado[]> = {
      data: [resultadoMock],
      mensaje: 'ok',
      codigoEstado: 200,
      links: []
    };

    service.getResultadosPorUsuario(10).subscribe(resp => {
      expect(resp).toEqual(respMock);
    });

    const req = httpMock.expectOne(`${apiUrl}/usuario/10`);
    expect(req.request.method).toBe('GET');

    req.flush(respMock);
  });
});
