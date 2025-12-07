import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { ResultadoFormComponent } from './resultado-form.component';
import { resultadoService } from 'src/app/services/resultado.service';
import { EstadoResultado } from 'src/app/models/EstadoResultado';

describe('ResultadoFormComponent', () => {
  let component: ResultadoFormComponent;
  let fixture: ComponentFixture<ResultadoFormComponent>;
  let resultadoServiceSpy: jasmine.SpyObj<resultadoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    resultadoServiceSpy = jasmine.createSpyObj('resultadoService', [
      'getResultadoById',
      'crearResultado',
      'actualizarResultado'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
 
    activatedRouteStub = {
      snapshot: {
        paramMap: convertToParamMap({})
      },
      paramMap: of(convertToParamMap({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        ResultadoFormComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: resultadoService, useValue: resultadoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en modo NUEVO', () => {
    // id no seteado
    expect(component.id).toBeUndefined();
    expect(component.titulo).toBe('Nuevo Resultado');

    expect(component.form).toBeDefined();
    const creado = component.form.get('creado')!.value;
    expect(creado).not.toBeNull();
  });

  it('debe calcular fechaResultado +3 días cuando cambia fechaMuestra', () => {
    const fechaBase = '2025-01-10';
    component.form.get('fechaMuestra')!.setValue(fechaBase);

    const fechaResult = component.form.get('fechaResultado')!.value as string;
    // 10 + 3 = 13
    expect(fechaResult).toBe('2025-01-13');
  });

  it('guardar() no debe llamar al servicio si el formulario es inválido', () => {
    // formulario vacío → inválido
    expect(component.form.invalid).toBeTrue();

    const markSpy = spyOn(component.form, 'markAllAsTouched').and.callThrough();

    component.guardar();

    expect(markSpy).toHaveBeenCalled();
    expect(resultadoServiceSpy.crearResultado).not.toHaveBeenCalled();
    expect(resultadoServiceSpy.actualizarResultado).not.toHaveBeenCalled();
  });

  it('guardar() debe crear un nuevo resultado cuando no hay id', () => {
    // seteamos valores válidos
    component.form.patchValue({
      usuarioId: 10,
      tipo: 'SANGRE',
      idLaboratorio: 5,
      valores: 'Hemograma OK',
      fechaMuestra: '2025-01-01',
      // fechaResultado y estado se manejan en el componente
      creado: new Date(),
      actualizado: null
    });

    // simulamos que el servicio responde OK
    resultadoServiceSpy.crearResultado.and.returnValue(of({} as any));

    component.guardar();

    expect(resultadoServiceSpy.crearResultado).toHaveBeenCalled();

    const payloadEnviado: any = resultadoServiceSpy.crearResultado.calls.mostRecent().args[0];

    expect(payloadEnviado.usuario).toEqual({ id: 10 });
    expect(payloadEnviado.usuarioId).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
  });

  it('guardar() debe actualizar cuando hay id (modo EDICIÓN)', () => {
    // Preparamos el ActivatedRoute para simular /resultados/editar/1
    const nuevoActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: '1' })
      },
      paramMap: of(convertToParamMap({ id: '1' }))
    };

    TestBed.resetTestingModule();
    return TestBed.configureTestingModule({
      imports: [
        ResultadoFormComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: resultadoService, useValue: resultadoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: nuevoActivatedRoute }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ResultadoFormComponent);
      component = fixture.componentInstance;

      // simula que cargarResultado trae un resultado
      resultadoServiceSpy.getResultadoById.and.returnValue(of({
        id: 1,
        usuarioId: 10,
        tipo: 'SANGRE',
        idLaboratorio: 1,
        valores: '123',
        fechaMuestra: '2025-01-01',
        fechaResultado: '2025-01-04',
        estado: EstadoResultado.En_Proceso,
        creado: '2025-01-01',
        actualizado: null
      } as any));

      fixture.detectChanges(); // ngOnInit y cargarResultado()

      expect(component.id).toBe(1);
      expect(component.titulo).toBe('Editar Resultado');
      expect(resultadoServiceSpy.getResultadoById).toHaveBeenCalledWith(1);

      // ahora modifica algún campo permitido (por ejemplo valores y estado)
      component.form.get('valores')!.setValue('Nuevo valor');
      component.form.get('estado')!.setValue(EstadoResultado.Finalizado);

      resultadoServiceSpy.actualizarResultado.and.returnValue(of({} as any));

      component.guardar();

      expect(resultadoServiceSpy.actualizarResultado).toHaveBeenCalledWith(
        1,
        jasmine.any(Object)
      );
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
    });
  });

  it('cancelar() debe navegar a /resultados', () => {
    component.cancelar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
  });

  it('volverALaLista() debe navegar a /resultados', () => {
    component.volverALaLista();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/resultados']);
  });
});
