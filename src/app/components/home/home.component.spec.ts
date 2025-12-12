import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,        // standalone component
        RouterTestingModule   // provee ActivatedRoute, Router, etc.
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the carrusel component', () => {
    const element: HTMLElement = fixture.nativeElement;
    const carrusel = element.querySelector('app-carrusel');
    expect(carrusel).toBeTruthy();
  });
});
