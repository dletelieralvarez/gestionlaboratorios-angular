export interface ApiResponse<T>{
    mensaje:string; 
    data:T;
    codigoEstado:number;
    links:any;
}