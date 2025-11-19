import { Routes } from '@angular/router';
import { ResultadoListaComponent } from './components/resultado-lista/resultado-lista.component';
import { ResultadoFormComponent } from './components/resultado-form/resultado-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'resultados', pathMatch: 'full' },
    {
        path: 'resultados',
        children: [
        // /resultados  -> lista
        { path: '', component: ResultadoListaComponent },

        // /resultados/nuevo  -> crear
        { path: 'nuevo', component: ResultadoFormComponent },

        // /resultados/editar/6  -> editar id=6
        { path: 'editar/:id', component: ResultadoFormComponent }
        ]
    },

    { path: '**', redirectTo: 'resultados' }

];
