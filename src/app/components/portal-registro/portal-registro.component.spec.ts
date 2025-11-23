import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalRegistroComponent } from './portal-registro.component';

describe('PortalRegistroComponent', () => {
  let component: PortalRegistroComponent;
  let fixture: ComponentFixture<PortalRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalRegistroComponent]
    });
    fixture = TestBed.createComponent(PortalRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
