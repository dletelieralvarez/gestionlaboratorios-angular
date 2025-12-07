import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolListaComponent } from './rol-lista.component';
import { rolService } from 'src/app/services/rol.service';
import { of, throwError } from 'rxjs';
import { Rol } from 'src/app/models/Rol';

describe('RolListaComponent', () => {

  let component: RolListaComponent;
  let fixture: ComponentFixture<RolListaComponent>;
  let rolServiceSpy: jasmine.SpyObj<rolService>;

  beforeEach(async () => {

    rolServiceSpy = jasmine.createSpyObj('rolService', [
      'getAllRoles'
    ]);

    await TestBed.configureTestingModule({
      imports: [RolListaComponent],
      providers: [
        { provide: rolService, useValue: rolServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RolListaComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar roles', () => {

    const mockRoles: Rol[] = [
      { id: 1, nombreRol: 'ADMIN' },
      { id: 2, nombreRol: 'CLIENTE' },
    ];

    rolServiceSpy.getAllRoles.and.returnValue(of(mockRoles));

    fixture.detectChanges();   // llama ngOnInit

    expect(component.roles.length).toBe(2);
    expect(component.roles).toEqual(mockRoles);
    expect(rolServiceSpy.getAllRoles).toHaveBeenCalled();
  });

  it('ngOnInit debe manejar error sin romper', () => {

    rolServiceSpy.getAllRoles.and.returnValue(throwError(() => new Error('Error')));

    spyOn(console, 'error');   // evita ruido en consola

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(component.roles.length).toBe(0);
  });
});
