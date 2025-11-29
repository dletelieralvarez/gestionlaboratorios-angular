import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable, map } from 'rxjs';   
import { environment } from 'src/environments/environments';
import { ApiResponse } from '../models/ApiRespose';
import { Resultado } from '../models/Resultado';

@Injectable({
  providedIn: 'root'
})
export class resultadoService{
    private readonly apiUrl= `${environment.apiBaseUrl}/api/resultados`;

    constructor(private http: HttpClient){}

    getAllResultado(){
        return this.http.get<ApiResponse<Resultado[]>>(`${this.apiUrl}`);
    }

    getResultadoById(id:number): Observable<Resultado>{
            return this.http.get<ApiResponse<Resultado>>(`${this.apiUrl}/${id}`).pipe(
            map(resp => resp.data)
        );
    }

    crearResultado(data: Resultado): Observable<Resultado> {
        return this.http
            .post<ApiResponse<Resultado>>(this.apiUrl, data)
            .pipe(map(resp => resp.data));
    }

    actualizarResultado(id: number, resultado: Resultado): Observable<Resultado>{
            return this.http.put<ApiResponse<Resultado[]>>(`${this.apiUrl}/${id}`, resultado).pipe(
            map(resp => resp.data[0])
        );
    }

    eliminarResultado(id:number): Observable<string>{
            return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`).pipe(
            map(resp=> resp.mensaje)
        );
    }

    /*
    getResultadoPorUsuarioYTipo(usuarioId: number, tipoAnalisis?: string): Observable<resultado | null> {
        const params = tipoAnalisis ? { tipoAnalisis } : {};

        return this.http
            .get<ApiResponse<resultado | null>>(`${this.apiUrl}/usuario/${usuarioId}`, { params })
            .pipe(map((resp: ApiResponse<resultado | null>) => resp.data));
    }
    */
   
    buscarPorFiltros(
        usuarioId?: number, 
        idLaboratorio?: number, 
        fechaMuestra?: string
    ): Observable<Resultado[]>{

        const params: any={}; 
        if(usuarioId != null) params.usuarioId = usuarioId; 
        if(idLaboratorio != null) params.idLaboratorio = idLaboratorio; 
        if(fechaMuestra) params.fechaMuestra = fechaMuestra; 

        return this.http
            .get<ApiResponse<Resultado[]>>(`${this.apiUrl}/filtros`, { params })
            .pipe(map(resp => resp.data));
    }

    getResultadosPorUsuario(usuarioId:number){
        return this.http.get<ApiResponse<Resultado[]>>(`${this.apiUrl}/usuario/${usuarioId}`);
    }

    
}
