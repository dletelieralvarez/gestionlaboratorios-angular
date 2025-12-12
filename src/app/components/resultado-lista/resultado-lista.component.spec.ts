import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ResultadoListaComponent } from './resultado-lista.component';
import { resultadoService } from 'src/app/services/resultado.service';
import { Resultado } from 'src/app/models/Resultado';

describe('ResultadoListaComponent', () => {
  let component: ResultadoListaComponent;
  let fixture: ComponentFixture<ResultadoListaComponent>;

  let resultadoServiceSpy: jasmine.SpyObj<resultadoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const resultadoSpy = jasmine.createSpyObj('resultadoService', [
      'getResultadosPorUsuario',
      'getAllResultado',
      'eliminarResultado'
    ]);

    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ResultadoListaComponent],
      providers: [
        { provide: resultadoService, useValue: resultadoSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoListaComponent);
    component = fixture.componentInstance;

    resultadoServiceSpy = TestBed.inject(
      resultadoService
    ) as jasmine.SpyObj<resultadoService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar getResultadosPorUsuario cuando rol es CLIENTE y hay id', () => {
    const resultadoMock: Resultado = {
      id: 1,
      usuarioId: 10,
      tipo: 'HEMOGRAMA' as any,
      idLaboratorio: 1,
      valores: 'ok',
      fechaMuestra: '2025-01-01',
      fechaResultado: '2025-01-04',
      estado: 'En_Proceso' as any,
      creado: new Date('2025-01-01'),
      actualizado: new Date('2025-01-01')
    };

    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'CLIENTE';
        if (key === 'id') return '5';
        return null;
      }
    );

    resultadoServiceSpy.getResultadosPorUsuario.and.returnValue(
      of({ data: [resultadoMock] } as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getResultadosPorUsuario).toHaveBeenCalledWith(5);
    expect(resultadoServiceSpy.getAllResultado).not.toHaveBeenCalled();
    expect(component.resultados).toEqual([resultadoMock]);
  });

  // error en getResultadosPorUsuario dentro de ngOnInit
  it('ngOnInit como CLIENTE con error del servicio debe llamar console.error', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'CLIENTE';
        if (key === 'id') return '5';
        return null;
      }
    );

    const consoleSpy = spyOn(console, 'error');

    resultadoServiceSpy.getResultadosPorUsuario.and.returnValue(
      throwError(() => 'Error cargando resultados por usuario' as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getResultadosPorUsuario).toHaveBeenCalledWith(5);
    expect(consoleSpy).toHaveBeenCalled();
    expect(component.resultados).toEqual([]); // sigue vacío
  });

  // CLIENTE + id pero resp.data es null → usa [] del "|| []"
  it('ngOnInit como CLIENTE con id y sin data debe dejar resultados vacío', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'CLIENTE';
        if (key === 'id') return '5';
        return null;
      }
    );

    resultadoServiceSpy.getResultadosPorUsuario.and.returnValue(
      of({ data: null } as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getResultadosPorUsuario).toHaveBeenCalledWith(5);
    expect(component.resultados).toEqual([]); // rama derecha del "resp.data || []"
  });

  it('ngOnInit debe llamar getAllResultado cuando rol no es CLIENTE o no hay id', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'ADMIN';
        if (key === 'id') return null;
        return null;
      }
    );

    const resultadoMock: Resultado = {
      id: 2,
      usuarioId: 20,
      tipo: 'OTRO' as any,
      idLaboratorio: 2,
      valores: 'valores',
      fechaMuestra: '2025-02-01',
      fechaResultado: '2025-02-04',
      estado: 'En_Proceso' as any,
      creado: new Date('2025-01-01'),
      actualizado: new Date('2025-02-01')
    };

    resultadoServiceSpy.getAllResultado.and.returnValue(
      of({ data: [resultadoMock] } as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(component.resultados).toEqual([resultadoMock]);
  });

  // error en getAllResultado dentro de ngOnInit
  it('ngOnInit como ADMIN con error del servicio debe llamar console.error', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'ADMIN';
        if (key === 'id') return null;
        return null;
      }
    );

    const consoleSpy = spyOn(console, 'error');

    resultadoServiceSpy.getAllResultado.and.returnValue(
      throwError(() => 'Error cargando todos los resultados' as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(component.resultados).toEqual([]);
  });

  // rol no CLIENTE + sin data → usa [] del "resp.data || []"
  it('ngOnInit como ADMIN sin data debe dejar resultados vacío', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'ADMIN';
        if (key === 'id') return null;
        return null;
      }
    );

    resultadoServiceSpy.getAllResultado.and.returnValue(
      of({ data: null } as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(component.resultados).toEqual([]);
  });

  //rol null → usa '' por el operador ?? y entra al else (getAllResultado)
  it('ngOnInit cuando rol es null usa valor vacío y llama getAllResultado', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return null;   // fuerza rama derecha del ??
        if (key === 'id') return '5';     // hay id, pero rol = ''
        return null;
      }
    );

    const listaMock: Resultado[] = [
      {
        id: 10,
        usuarioId: 5,
        tipo: 'OTRO' as any,
        idLaboratorio: 1,
        valores: 'x',
        fechaMuestra: '2025-01-01',
        fechaResultado: '2025-01-02',
        estado: 'En_Proceso' as any,
        creado: new Date('2025-01-01'),
        actualizado: new Date('2025-01-01'),
      }
    ];

    resultadoServiceSpy.getAllResultado.and.returnValue(
      of({ data: listaMock } as any)
    );

    component.ngOnInit();

    expect(resultadoServiceSpy.getResultadosPorUsuario).not.toHaveBeenCalled();
    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(component.rolUsuario).toBe('');           // rama derecha del ??
    expect(component.resultados).toEqual(listaMock);
  });

  //rol CLIENTE pero idUsuario = 0 → izquierda del && true, derecha false
  it('ngOnInit cuando rol es CLIENTE pero idUsuario es 0 debe llamar getAllResultado', () => {
    spyOn(window.localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        if (key === 'rol') return 'CLIENTE';
        if (key === 'id') return '0';   // Number('0') = 0 → falsy
        return null;
      }
    );

    const listaMock: Resultado[] = [
      {
        id: 11,
        usuarioId: 0,
        tipo: 'OTRO' as any,
        idLaboratorio: 2,
        valores: 'y',
        fechaMuestra: '2025-02-01',
        fechaResultado: '2025-02-02',
        estado: 'En_Proceso' as any,
        creado: new Date('2025-02-01'),
        actualizado: new Date('2025-02-01'),
      }
    ];

    resultadoServiceSpy.getAllResultado.and.returnValue(
      of({ data: listaMock } as any)
    );

    component.ngOnInit();

    // rol === CLIENTE pero idUsuario = 0 → la condición del if falla y entra al else
    expect(resultadoServiceSpy.getResultadosPorUsuario).not.toHaveBeenCalled();
    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(component.resultados).toEqual(listaMock);
  });

  it('cargarResultados debe llenar el arreglo resultados', () => {
    const lista: Resultado[] = [
      {
        id: 3,
        usuarioId: 30,
        tipo: 'TIPO' as any,
        idLaboratorio: 3,
        valores: 'algo',
        fechaMuestra: '2025-03-01',
        fechaResultado: '2025-03-04',
        estado: 'En_Proceso' as any,
        creado: new Date('2025-01-01'),
        actualizado: new Date('2025-01-01'),
      }
    ];

    resultadoServiceSpy.getAllResultado.and.returnValue(
      of({ data: lista } as any)
    );

    component.cargarResultados();

    expect(resultadoServiceSpy.getAllResultado).toHaveBeenCalled();
    expect(component.resultados).toEqual(lista);
  });

  // error en cargarResultados → cubre rama error del subscribe
  it('cargarResultados error debe llamar console.error', () => {
    const consoleSpy = spyOn(console, 'error');

    resultadoServiceSpy.getAllResultado.and.returnValue(
      throwError(() => 'Error desde servicio' as any)
    );

    component.cargarResultados();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('nuevoResultado debe navegar a /resultados/nuevo', () => {
    component.nuevoResultado();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados/nuevo']);
  });

  it('editarResultado debe navegar a resultados/editar/:id', () => {
    component.editarResultado(99);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['resultados/editar', 99]);
  });

  it('eliminarResultado NO debe llamar al servicio si id es truthy (por la condición actual)', () => {
    const eliminarSpy = resultadoServiceSpy.eliminarResultado.and.returnValue(
      of(null as any)
    );

    component.eliminarResultado(123);

    expect(eliminarSpy).not.toHaveBeenCalled();
  });

  it('eliminarResultado debe llamar al servicio cuando id es 0 y usuario confirma', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const eliminarSpy = resultadoServiceSpy.eliminarResultado.and.returnValue(
      of(null as any)
    );
    const cargarSpy = spyOn(component, 'cargarResultados');

    component.eliminarResultado(0);

    expect(eliminarSpy).toHaveBeenCalledWith(0);
    expect(cargarSpy).toHaveBeenCalled();
  });

  it('eliminarResultado no debe llamar al servicio cuando usuario cancela confirm', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    const eliminarSpy = resultadoServiceSpy.eliminarResultado.and.returnValue(
      of(null as any)
    );

    component.eliminarResultado(0);

    expect(eliminarSpy).not.toHaveBeenCalled();
  });

  // error en eliminarResultado → cubre rama error del subscribe
  it('eliminarResultado error debe llamar console.error y no recargar la lista', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const consoleSpy = spyOn(console, 'error');
    const cargarSpy = spyOn(component, 'cargarResultados');

    resultadoServiceSpy.eliminarResultado.and.returnValue(
      throwError(() => 'Error al eliminar' as any)
    );

    component.eliminarResultado(0);

    expect(consoleSpy).toHaveBeenCalled();
    expect(cargarSpy).not.toHaveBeenCalled();
  });
});
