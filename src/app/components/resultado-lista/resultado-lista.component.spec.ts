import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoListaComponent } from './resultado-lista.component';

describe('ResultadoListaComponent', () => {
  let component: ResultadoListaComponent;
  let fixture: ComponentFixture<ResultadoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResultadoListaComponent]
    });
    fixture = TestBed.createComponent(ResultadoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
