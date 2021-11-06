import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { IUsuario } from 'src/app/modelos/usuario';
import { ExcelService } from 'src/app/services/excel.service';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild(MatTable,{static:false}) usuarioTabla: MatTable<IUsuario>;
  @ViewChild(MatPaginator,{static:false}) paginador: MatPaginator;
  public usuarios: MatTableDataSource<IUsuario> = new MatTableDataSource<IUsuario>([]);

  public columnas = ['foto','nombre','correo','numero','planta','deparamento','autorizado','regional'];

  public seleccionTipo: FormControl = new FormControl(null);

  public roles = ['superUser','admin','user'];

  public plantas :string[]=[];
  public departamentos: string [] = [];

  public regionales: FormControl = new FormControl(0);


  constructor(
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar,
    private firebaseDB: AngularFireDatabase,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {


  }



  public descargarExcel(){

    const columnas = [];

    this.usuarioPropiedades.forEach( uPropiedades =>{

      if( uPropiedades.check ){
        columnas.push( uPropiedades.propiedad );
      }

    });


    const usuariosColumnas = [];

    for( let i=0; i< this.usuarios.data.length; i++){

       usuariosColumnas[i] = {};

      columnas.forEach( columna =>{

        usuariosColumnas[i][columna] = this.usuarios.data[i][columna];

      });

    }

     this.excelService.exportarAExcel( usuariosColumnas , `${this.tiposBusqudas[ this.seleccionTipo.value] }-${new Date().getMilliseconds()}`);
  }

  public numeroDeUsuario( numero:string ){

    //console.log('Se busca el ', numero);

    const numeroR = parseInt( numero );

    this.firestore.collection<IUsuario>('users', query => query.where('employeeNumber','==', numeroR )
    .limit(1))
    .get().subscribe( documentos => this.cargarUsuarios( documentos ) );

}


  public seleccionDia( fecha : Date ){

    if( fecha <= new Date() ){


      if( this.regionales.value == 0){
        this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==', fecha.toLocaleDateString() )
       )
     .get().subscribe( documentos => this.cargarUsuarios( documentos ) );
      }else{

        this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==', fecha.toLocaleDateString() )
       .where('regional','==', this.regionales.value == 1 ? true: false ))
     .get().subscribe( documentos => this.cargarUsuarios( documentos ) );

      }


    }else{

      this.mostrarSncak('Fecha no valida','snackRojo');

    }

  

  }

  public buscarPorPlanta(planta:string){

    if( this.regionales.value == 0){
    this.firestore.collection<IUsuario>('users', query => query.where('idPlant','==', planta ) )
        .get().subscribe( documentos => this.cargarUsuarios( documentos ) );

    }else{

      this.firestore.collection<IUsuario>('users', query => query.where('idPlant','==', planta )
      .where('regional','==', this.regionales.value == 1 ? true: false ))
      .get().subscribe( documentos => this.cargarUsuarios( documentos ) );


    }


  }

  public buscarPorDepartamento(departamento:string){

    if( this.regionales.value == 0){

      this.firestore.collection<IUsuario>('users', query => query.where('idDepartment','==', departamento ))
    .get().subscribe( documentos => this.cargarUsuarios( documentos ));
    }else{

      this.firestore.collection<IUsuario>('users', query => query.where('idDepartment','==', departamento )
      .where('regional','==', this.regionales.value == 1 ? true: false ))
    .get().subscribe( documentos => this.cargarUsuarios( documentos ));

    }

    



  }

  public buscarPorRole(role:string){

    if( this.regionales.value == 0){

      this.firestore.collection<IUsuario>('users', query =>
      query.where('idRole','==', role )
      
    )
    .get().subscribe( documentos => this.cargarUsuarios( documentos ) );
    }else{

      this.firestore.collection<IUsuario>('users', query =>
      query.where('idRole','==', role )
      .where('regional','==',this.regionales.value == 1 ? true: false)
    )
    .get().subscribe( documentos => this.cargarUsuarios( documentos ) );

    }

    



  }

  private cargarPlantas(){

    if( this.plantas.length == 0){
      this.firebaseDB.database.ref('plant').get()
      .then( (plantas)=>{
      
        plantas.forEach( planta =>{
          
          const { name } = planta.toJSON() as any;
    
          this.plantas.push( name );
          
        })
    
        //console.log('Se cargaron las plantas', this.plantas);
    
      });
    }

    


  }

  private cargarDepartamentos(){


    if(this.departamentos.length == 0){
      this.firebaseDB.database.ref('departament').get()
      .then( (departamentos)=>{
      
        departamentos.forEach( departamento =>{
          
          const { name } = departamento.toJSON() as any;
    
          this.departamentos.push( name );
          
        })
    
        //console.log('Se cargaron los departamentos', this.departamentos);
    
      });
    }

    


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
      
      case 7: this.cargarTodosUsuarios();
      break;


    }


  }

  public cargarTodosUsuarios(){

    if( this.regionales.value ==0 ){

      this.firestore.collection<IUsuario>('users')
    .get().subscribe( documentos => {

      this.cargarUsuarios( documentos);

    });

    }else{

      this.firestore.collection<IUsuario>('users', query =>
         query.where('regional','==', this.regionales.value ==1 ? true : false )
      
       )
      .get().subscribe( documentos => {
  
        this.cargarUsuarios( documentos);
  
      });

    }


    

  }


  public async actualizarRegional(id:string, regional:boolean){


    this.firestore.doc('users/'+id).update({regional})
    .then( () =>{

      this.mostrarSncak(`Se actualizo el usuario`,'snackVerde');
      //console.log('Se actualizo la propiedad a: ', authorized);
    })
    .catch( err =>{
      this.mostrarSncak(`Error al actualizar el usuario`,'snackRojo')
      console.log('Error al actualizar la autorizaion ',err);
    });

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

    if(this.regionales.value == 0){
      this.firestore.collection<IUsuario>('users', query => query.where('authorized','==', false ))
     .get().subscribe( documentos => this.cargarUsuarios( documentos ) );
    }else{

      this.firestore.collection<IUsuario>('users', query => query.where('authorized','==', false )
    .where('regional', '==', this.regionales.value ==1 ? true : false ))
   .get().subscribe( documentos => this.cargarUsuarios( documentos ) );
    }

    

  }

  private registradosDeHoy(){

    if(this.regionales.value == 0){

      this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==',new Date().toLocaleDateString()
      ))
     .get().subscribe( documentos => this.cargarUsuarios( documentos ) );


    }else{
      this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==',new Date().toLocaleDateString()
    ).where('regional', '==', this.regionales.value ==1 ? true : false ) )
   .get().subscribe( documentos =>  this.cargarUsuarios( documentos ) );
    }

   


  }

  private cargarUsuarios( documentos : QuerySnapshot<IUsuario>){
    
    this.usuarios.data =[];

    if(!documentos.empty){
      documentos.forEach( documento =>{
      const usuario: IUsuario = (documento.data() as IUsuario);
      usuario.id = documento.id;

      this.usuarios.data.push( usuario );
    });

    this.usuarioTabla.renderRows();
    this.usuarios.paginator = this.paginador;
    }else{
      this.mostrarSncak('No se encontraon usuarios','snackVerde');
    }

    

  }

  private mostrarSncak(mensaje: string, color:string){

    this.matSnack.open(mensaje, null, {
      panelClass: color,
      duration: 3000
    });


  }

  public usuarioPropiedades =[
    {
      nombre:'Autorizado',
      check: false,
      propiedad: 'authorized'
    },
    {
      nombre:'Fecha de nacimiento',
      check:false,
      propiedad: 'birthDate'
    },
    {
      nombre:'Correo',
      check:false,
      propiedad:'email'
    },
    {
      nombre:'Numero de emepleado',
      check :true,
      propiedad:'employeeNumber'
    },
    {
      nombre:'Nombre',
      check:false,
      propiedad: 'fullName'
    },
    {
      nombre:'Departamento',
      check:false,
      propiedad: 'idDepartment'
    },
    {
      nombre:'Planta',
      check:false,
      propiedad: 'idPlant'
    },
    {
      nombre:'Fecha de registro',
      check:false,
      propiedad: 'fechaRegistro'
    },
    {
      nombre:'Regional',
      check:false,
      propiedad: 'regional'
    }
  ];


  public tiposBusqudas = [
    'Registrados de hoy',
    'Usuarios no autorizados',
    'Por dia de registro',
    'Por numero de usuario',
    'Por planta',
    'Por departamento',
    'Por role',
    'Todos los usuarios'
  ];

  public regionalesFiltro=[
    'Ambos',
    'Regionales',
    'No regionales'
  ];

}


