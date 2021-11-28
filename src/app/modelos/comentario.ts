import { IUsuario }  from '../modelos/usuario'

export interface IComentario {
    key?: string;
    autor:IUsuario;
    nombreMaestro:string;
    materia: string;
    clave: string;
    plantel: string;
    comentario:string;
    conocimiento: string;
    puntualidad: number;
    dificultad: number;
    calificacion: number;   
    tituloComentario:string;
}