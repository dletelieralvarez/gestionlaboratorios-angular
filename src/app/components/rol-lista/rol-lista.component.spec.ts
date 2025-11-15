import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolListaComponent } from './rol-lista.component';

describe('RolListaComponent', () => {
  let component: RolListaComponent;
  let fixture: ComponentFixture<RolListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RolListaComponent]
    });
    fixture = TestBed.createComponent(RolListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
