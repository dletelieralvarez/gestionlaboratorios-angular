import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoFormComponent } from './resultado-form.component';

describe('ResultadoFormComponent', () => {
  let component: ResultadoFormComponent;
  let fixture: ComponentFixture<ResultadoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResultadoFormComponent]
    });
    fixture = TestBed.createComponent(ResultadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
