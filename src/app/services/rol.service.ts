import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable, map } from 'rxjs';   
import { environment } from 'src/environments/environments';
import {Rol} from '../models/Rol'; 
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { ApiResponse } from '../models/ApiRespose';

@Injectable(
    {
        providedIn:'root'
    }
)
export class rolService{
    private readonly apiUrl = `${environment.apiBaseUrl}/roles`;
    constructor(private http: HttpClient) {}

    //lista todos los rol
    getAllRoles(): Observable<Rol[]>{
        return this.http.get<ApiResponse<Rol[]>>(this.apiUrl).pipe(
            map(resp=> resp.data)
        ); 
    }

    //obtiene rol por id
    getRolById(id:number):Observable<Rol>{
        return this.http.get<ApiResponse<Rol>>(`${this.apiUrl}/${id}`).pipe(
            map(resp=> resp.data)
        );
    }

    //metodo post que inserta un rol 
    createRol(data: Omit<Rol,'id'>): Observable<Rol>{
        return this.http.post<ApiResponse<Rol>>(this.apiUrl, data).pipe(
        map(resp => resp.data) 
        );
    }

    //metodo put para actualizar la descripcion de un rol
    updateRol(id:number, data:Partial<Rol>):Observable<Rol>{
        return this.http.put<ApiResponse<Rol>>(`${this.apiUrl}/${id}`, data).pipe(
        map(resp => resp.data) 
        ); 
    }

    //elimina un rol por su id
    deleteRol(id:number):Observable<string>{
            return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/${id}`).pipe(
            map(resp => resp.mensaje) 
        ); 
    }
}