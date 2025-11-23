import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalRecuperarPasswordComponent } from './portal-recuperar-password.component';

describe('PortalRecuperarPasswordComponent', () => {
  let component: PortalRecuperarPasswordComponent;
  let fixture: ComponentFixture<PortalRecuperarPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalRecuperarPasswordComponent]
    });
    fixture = TestBed.createComponent(PortalRecuperarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
