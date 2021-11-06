export interface IIngresoApp{
fecha: string;
email:string;
employeeNumber: number;
fullName: string;
idDepartment:string;
idPlant: string;
idRole:string;
image: string;
regional : boolean;
};


export interface IIngresoNoticia extends IIngresoApp{
    idNoticia:string;
    id?:string; 
}