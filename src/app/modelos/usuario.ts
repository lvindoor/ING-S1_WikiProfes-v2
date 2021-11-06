export interface IUsuario{
authorized: boolean;
birthDate: string;
email:string;
employeeNumber: number;
fullName: string;
id?:string;
idDepartment:string;
idPlant: string;
idRole:string;
image: string;   
token?: string;
fechaRegistro ?: string; 
plantasCategorias ?: string[];
departamentosCategorias ?:string[];
regional ?: boolean;
}