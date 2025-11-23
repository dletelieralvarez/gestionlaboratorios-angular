export interface RecuperarPassword {
  rutOrEmail: string;  
  //con el ? le indico que es opcional
  tempPassword?: string;
}