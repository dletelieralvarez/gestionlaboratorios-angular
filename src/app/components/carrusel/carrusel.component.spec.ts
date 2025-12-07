import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CarruselComponent } from './carrusel.component';

describe('CarruselComponent', () => {
  let component: CarruselComponent;
  let fixture: ComponentFixture<CarruselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CarruselComponent]
    });

    fixture = TestBed.createComponent(CarruselComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial index 0', () => {
    expect(component.indiceActual).toBe(0);
  });

  it('should go to next image', () => {
    component.siguiente();
    expect(component.indiceActual).toBe(1);
  });

  it('should go to previous image', () => {
    component.indiceActual = 1;
    component.anterior();
    expect(component.indiceActual).toBe(0);
  });

  it('should go to a specific index', () => {
    component.irA(5);
    expect(component.indiceActual).toBe(5);
  });

  it('should auto change with interval', fakeAsync(() => {
    component.ngOnInit();

    tick(5000); // avanza el tiempo simulado
    expect(component.indiceActual).toBe(1);

    tick(5000); 
    expect(component.indiceActual).toBe(2);
  }));

  it('should clear interval on destroy', () => {
    component.ngOnInit();
    const id = (component as any).intervaloId;

    spyOn(window, 'clearInterval');
    component.ngOnDestroy();

    expect(window.clearInterval).toHaveBeenCalledWith(id);
  });
});
