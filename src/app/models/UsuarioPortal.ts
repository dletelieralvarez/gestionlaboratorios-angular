export interface LoginUsuarioPortalDTO {
  rut: string;
  password: string;
}

export interface UsuarioPortalDTO {
  id: number;
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  rolId: number; 
  nombreRol: string;
  creado: string;        
  actualizado?: string;  
}