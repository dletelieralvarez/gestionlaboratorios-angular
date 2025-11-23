import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalPerfilComponent } from './portal-perfil.component';

describe('PortalPerfilComponent', () => {
  let component: PortalPerfilComponent;
  let fixture: ComponentFixture<PortalPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalPerfilComponent]
    });
    fixture = TestBed.createComponent(PortalPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
