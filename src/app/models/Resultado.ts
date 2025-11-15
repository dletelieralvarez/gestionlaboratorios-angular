import { EstadoResultado } from "./EstadoResultado";
import { TipoAnalisis } from "./TipoAnalisis";

export interface Resultado{
    id?:number, 
    usuarioId:number, 
    tipo:TipoAnalisis,
    idLaboratorio:number, 
    valores:string, 
    fechaMuestra:string, 
    fechaResultado:string, 
    estado:EstadoResultado,
    creado:Date,
    actualizado?:Date
}