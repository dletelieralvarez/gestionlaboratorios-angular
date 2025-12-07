import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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

    // Mock de localStorage
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
    // id = 0 pasa la condición `if(!!id) return;`
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
});
