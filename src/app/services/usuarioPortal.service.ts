import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUsuarioPortalDTO, UsuarioPortalDTO } from '../models/UsuarioPortal';
import { environment } from 'src/environments/environments';
import { ApiResponse } from '../models/ApiRespose';
import { RegistroUsuarioPortal } from '../models/RegistroUsuarioPortal';
import { RecuperarPassword } from '../models/RecuperarPassword';
import { PerfilUsuarioPortalDTO } from '../models/PerfilUsuarioPortalDTO';

@Injectable({ 
  providedIn: 'root' 
})
export class UsuariosPortalService {

  private readonly apiUrl= `${environment.apiBaseUrl}/api/portal`;

  constructor(private http: HttpClient) {}

  login(body: LoginUsuarioPortalDTO): Observable<ApiResponse<UsuarioPortalDTO>> {
    return this.http.post<ApiResponse<UsuarioPortalDTO>>(
      `${this.apiUrl}/login`,
      body
    );
  }

  registrar(body: RegistroUsuarioPortal): Observable<ApiResponse<UsuarioPortalDTO>> {
    return this.http.post<ApiResponse<UsuarioPortalDTO>>(
      `${this.apiUrl}/usuarios/registro`,      
      body
    );
  }

  recuperarPassword(body: RecuperarPassword): Observable<ApiResponse<RecuperarPassword>> {
   return this.http.post<ApiResponse<RecuperarPassword>>(
      `${this.apiUrl}/usuarios/recuperar-password`,
      body
    );
  }

  obtenerPerfil(id: number) {
    return this.http.get<ApiResponse<PerfilUsuarioPortalDTO>>(
      `${this.apiUrl}/usuarios/perfil/${id}`
    );
  }

  actualizarPerfil(perfil: PerfilUsuarioPortalDTO) {
    return this.http.put<ApiResponse<PerfilUsuarioPortalDTO>>(
      `${this.apiUrl}/usuarios/perfil/${perfil.id}`,
      perfil
    );
  }
}