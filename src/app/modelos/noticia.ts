import { DocumentReference } from "@angular/fire/firestore";
import { IUsuario } from "./usuario";

export interface INoticia{
admin:IAdmin;
categoria:string;
description:string;
dislike: IReaccion[];
like: IReaccion[];
encuesta:boolean;
endDate:string;
key?: string;
startDate:string;
title:string;
urlimg:string;

}


interface IReaccion{
date:string;
id:string;
like:boolean;
name:string;
number:string;    
}

export interface INew{
id?:string;
admin:IAdmin;
adminId:string
title:string;
description:string;
multimedia : IMultimedia[];
date: string;
links:string[];
encuesta:string[];
categoria:string;
}

interface IAdmin{
 fullName:string;
 image:string;   
}

interface IMultimedia{
    tipo:string;
    src:string;
}