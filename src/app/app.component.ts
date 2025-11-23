import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { RolListaComponent } from "./components/rol-lista/rol-lista.component";
import { ResultadoListaComponent } from "./components/resultado-lista/resultado-lista.component";
import { RolFormComponent } from "./components/rol-form/rol-form.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RolListaComponent, ResultadoListaComponent, RolFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gestionlaboratorios-angular';
}
