export interface IReaccion{
    id?:string;
    idUsuario:string;
    idNoticia:string;
    reaccion:string;
    usuario: IUsuarioReaccion
}

interface IUsuarioReaccion{
    nombre:string;
    img:string;
}