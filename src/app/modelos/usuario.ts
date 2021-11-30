export interface IUsuario {
    key?:string;
    email:string;
    nombreCompleto: string;
    role:string;
    image: string;   
    token?: string;
} 

export interface IUsuarioGoogle {
    displayName: string;
    email: string;
    photoURL: string;
} 