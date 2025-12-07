import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

  it('cerrarSesion debe limpiar localStorage, navegar a /home y recargar', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // deja algo en localStorage
    localStorage.setItem('id', '123');
    localStorage.setItem('otro', 'valor');

    // espía router.navigate
    const navigateSpy = router.navigate;

    // espía reload del navegador
    const reloadSpy = spyOn(window.location, 'reload' as any).and.callFake(() => {});

    // act
    app.cerrarSesion();

    // assertions inmediatas
    expect(localStorage.getItem('id')).toBeNull();
    expect(localStorage.getItem('otro')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);

    // avanza el tiempo del setTimeout(…, 20)
    tick(20);

    expect(reloadSpy).toHaveBeenCalled();
  }));

  it('irAMisExamenes debe ir a /resultados si está logueado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    localStorage.setItem('id', '999');

    app.irAMisExamenes();

    expect(router.navigate).toHaveBeenCalledWith(['/resultados']);
  });

  it('irAMisExamenes debe ir a /portal/login si NO está logueado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    localStorage.removeItem('id');

    app.irAMisExamenes();

    expect(router.navigate).toHaveBeenCalledWith(['/portal/login']);
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
