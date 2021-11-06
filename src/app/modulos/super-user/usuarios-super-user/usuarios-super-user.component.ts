import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IUsuario } from 'src/app/modelos/usuario';

@Component({
  selector: 'app-usuarios-super-user',
  templateUrl: './usuarios-super-user.component.html',
  styleUrls: ['./usuarios-super-user.component.css']
})
export class UsuariosSuperUserComponent implements OnInit {

  @ViewChild(MatTable,{static:false}) usuarioTabla: MatTable<IUsuario>;
  @ViewChild(MatPaginator,{static:false}) paginador: MatPaginator;
  public usuarios: MatTableDataSource<IUsuario> = new MatTableDataSource<IUsuario>([]);

  public columnas = ['foto','nombre','numero','planta','deparamento','role','autorizado'];

  public seleccionTipo: FormControl = new FormControl(null);

  public roles = ['superUser','admin','user'];

  public plantas :string[]=[];
  public departamentos: string [] = [];

  constructor(
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar,
    private firebaseDB: AngularFireDatabase
  ) { }

  ngOnInit(): void {
  
  }

  public busquedaTipo( index:number){

    switch( index ){

      case 0: this.registradosDeHoy();
      break;

      case 1: this.noAutorizados();
      break;

      case 4: this.cargarPlantas();
      break;
      
      case 5: this.cargarDepartamentos();
      break;  


    }


  }

  public actualizarAutorizado(id:string, authorized:boolean){
    
    //console.log('Cambio ha', id);

    this.firestore.doc('users/'+id).update({authorized})
    .then( () =>{

      this.mostrarSncak(`Se actualizo el usuario a ${authorized}`,'snackVerde');
      //console.log('Se actualizo la propiedad a: ', authorized);
    })
    .catch( err =>{
      this.mostrarSncak(`Error al actualizar el usuario`,'snackRojo')
      console.log('Error al actualizar la autorizaion ',err);
    });

    

  }

  private noAutorizados(){

    this.firestore.collection<IUsuario>('users', query => query.where('authorized','==', false ))
   .get().subscribe( documentos =>{

    if(!documentos.empty){

      this.cargarUsuarios( documentos );

    }else{
      //console.log('No se encontraron');
    }

   });

  }

  private registradosDeHoy(){

    this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==',new Date().toLocaleDateString() ))
    .get().subscribe( documentos =>{
 
     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSncak('No se encontraon usuarios de hoy','snackVerde');
      // console.log('No se encontraron');
     }
 
    });
 
 
   }
 
   private cargarUsuarios( documentos : QuerySnapshot<IUsuario>){
     
     this.usuarios.data =[];
 
     documentos.forEach( documento =>{
       const usuario: IUsuario = (documento.data() as IUsuario);
       usuario.id = documento.id;
 
       this.usuarios.data.push( usuario );
     });
 
     this.usuarioTabla.renderRows();
     this.usuarios.paginator = this.paginador;
 
   }

  public numeroDeUsuario( numero:string ){

    //console.log('Se busca el ', numero);

    const numeroR = parseInt( numero );

    this.firestore.collection<IUsuario>('users', query => query.where('employeeNumber','==', numeroR )
    .limit(1))
    .get().subscribe( documentos =>{  
    
      //console.log('Sale esto', documentos);

     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSncak('No se encontro el usuario','snackVerde');
      // console.log('No se encontraron');
     }

  });

}


  public seleccionDia( fecha : Date ){

    if( fecha <= new Date() ){

      this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==', fecha.toLocaleDateString() ))
   .get().subscribe( documentos =>{

    if(!documentos.empty){

      this.cargarUsuarios( documentos );

    }else{

      this.mostrarSncak('No se encontraon usuarios de ese dia','snackVerde');
      //console.log('No se encontraron');
    }

   });

    }else{

      this.mostrarSncak('Fecha no valida','snackRojo');

    }

  

  }

  public buscarPorPlanta(planta:string){

    this.firestore.collection<IUsuario>('users', query => query.where('idPlant','==', planta ))
    .get().subscribe( documentos =>{
 
     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSncak('No se encontraon usuarios de hoy','snackVerde');
       //console.log('No se encontraron');
     }
 
    });



  }

  public buscarPorDepartamento(departamento:string){

    this.firestore.collection<IUsuario>('users', query => query.where('idDepartment','==', departamento ))
    .get().subscribe( documentos =>{
 
     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSncak('No se encontraon usuarios de hoy','snackVerde');
      // console.log('No se encontraron');
     }
 
    });



  }

  public buscarPorRole(role:string){

    this.firestore.collection<IUsuario>('users', query => query.where('idRole','==', role ))
    .get().subscribe( documentos =>{
 
     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSncak('No se encontraon usuarios de hoy','snackVerde');
      // console.log('No se encontraron');
     }
 
    });



  }

  private cargarPlantas(){

    this.firebaseDB.database.ref('plant').get()
    .then( (plantas)=>{
    
      plantas.forEach( planta =>{
        
        const { name } = planta.toJSON() as any;
  
        this.plantas.push( name );
        
      })
  
      //console.log('Se cargaron las plantas', this.plantas);
  
    });


  }

  private cargarDepartamentos(){

    this.firebaseDB.database.ref('departament').get()
    .then( (departamentos)=>{
    
      departamentos.forEach( departamento =>{
        
        const { name } = departamento.toJSON() as any;
  
        this.departamentos.push( name );
        
      })
  
      //console.log('Se cargaron los departamentos', this.departamentos);
  
    });


  }

  public actualizarRole( id:string, idRole:string){


    this.firestore.doc('users/'+id).update({idRole})
    .then( () =>{

      this.mostrarSncak(`Se actualizo el usuario a ${idRole}`,'snackVerde');
      //console.log('Se actualizo la propiedad a: ', authorized);
    })
    .catch( err =>{
      this.mostrarSncak(`Error al actualizar el usuario`,'snackRojo')
      console.log('Error al actualizar el role ',err);
    });

  }

  private mostrarSncak(mensaje: string, color:string){

    this.matSnack.open(mensaje, null, {
      panelClass: color,
      duration: 3000
    });


  }

  public tiposBusqudas = [
    'Registrados de hoy',
    'Usuarios no autorizados',
    'Por dia de registro',
    'Por numero de usuario',
    'Por planta',
    'Por departamento',
    'Por role'
  ];

}


