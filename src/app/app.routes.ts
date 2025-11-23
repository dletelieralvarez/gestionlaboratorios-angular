import { Routes } from '@angular/router';
import { ResultadoListaComponent } from './components/resultado-lista/resultado-lista.component';
import { ResultadoFormComponent } from './components/resultado-form/resultado-form.component';
import { PortalLoginComponent } from './components/portal-login/portal-login.component';
import { HomeComponent } from './components/home/home.component';
import { PortalRegistroComponent } from './components/portal-registro/portal-registro.component';
import { PortalRecuperarPasswordComponent } from './components/portal-recuperar-password/portal-recuperar-password.component';
import { PortalPerfilComponent } from './components/portal-perfil/portal-perfil.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },

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
    //login
    { path: 'portal/login', component: PortalLoginComponent },
    
    //registro de usuario 
    {path:'portal/registro', component:PortalRegistroComponent}, 

    //recuperar passwor
    {path:'portal/recuperar-password', component:PortalRecuperarPasswordComponent}, 

    //perfil del usuario 
    {path:'portal/perfil', component:PortalPerfilComponent}, 

    { path: '**', redirectTo: '' },

];
