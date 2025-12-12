import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { RolListaComponent } from './components/rol-lista/rol-lista.component';
import { ResultadoListaComponent } from './components/resultado-lista/resultado-lista.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet, RolListaComponent, ResultadoListaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gestionlaboratorios-angular';

  constructor(private router: Router) {}

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/home']);

    // Si está en Karma (tests), NO hacer reload de la página
    const runningInKarma = typeof (window as any).__karma__ !== 'undefined';

    /* istanbul ignore next */
    if (!runningInKarma) {
      setTimeout(() => {
        window.location.reload();
      }, 20);
    }
  }

  irAMisExamenes(): void {
    const logueado = !!localStorage.getItem('id');
    console.log('estalogueado?', logueado, localStorage);

    if (logueado) {
      // si está logueado → lista de resultados
      this.router.navigate(['/resultados']);
    } else {
      // si NO está logueado → login
      this.router.navigate(['/portal/login']);
    }
  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
