import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalLoginComponent } from './portal-login.component';

describe('PortalLoginComponent', () => {
  let component: PortalLoginComponent;
  let fixture: ComponentFixture<PortalLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalLoginComponent]
    });
    fixture = TestBed.createComponent(PortalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
