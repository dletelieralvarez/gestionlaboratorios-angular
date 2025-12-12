import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let router: Router;

  beforeEach(async () => {
    // Stub mínimo de ActivatedRoute para satisfacer la inyección del componente
    const activatedRouteStub = {
      snapshot: {
        paramMap: convertToParamMap({})
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule          // router de testing real
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('debe crearse', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe tener el título "gestionlaboratorios-angular"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('gestionlaboratorios-angular');
  });

it('cerrarSesion debe limpiar localStorage y navegar a /home', fakeAsync(() => {
  const fixture = TestBed.createComponent(AppComponent);
  const app = fixture.componentInstance;

  localStorage.setItem('id', '123');
  localStorage.setItem('otro', 'valor');

  const navigateSpy = spyOn(router, 'navigate');

  app.cerrarSesion();

  expect(localStorage.getItem('id')).toBeNull();
  expect(localStorage.getItem('otro')).toBeNull();
  expect(navigateSpy).toHaveBeenCalledWith(['/home']);

  // avanzamos el tiempo, pero ya no hay reload en Karma
  tick(20);
}));



  it('irAMisExamenes debe ir a /resultados si está logueado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    localStorage.setItem('id', '999');

    const navigateSpy = spyOn(router, 'navigate');

    app.irAMisExamenes();

    expect(navigateSpy).toHaveBeenCalledWith(['/resultados']);
  });

  it('irAMisExamenes debe ir a /portal/login si NO está logueado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    localStorage.removeItem('id');

    const navigateSpy = spyOn(router, 'navigate');

    app.irAMisExamenes();

    expect(navigateSpy).toHaveBeenCalledWith(['/portal/login']);
  });

  it('toggleMenu debe alternar isMenuOpen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.isMenuOpen).toBeFalse();

    app.toggleMenu();
    expect(app.isMenuOpen).toBeTrue();

    app.toggleMenu();
    expect(app.isMenuOpen).toBeFalse();
  });

  it('closeMenu debe cerrar el menú', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.isMenuOpen = true;
    app.closeMenu();
    expect(app.isMenuOpen).toBeFalse();
  });
});
