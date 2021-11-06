import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IUsuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';
import { ConfirmarComponent } from '../../componentes/confirmar/confirmar.component';

@Component({
  selector: 'app-depuracion-usuarios',
  templateUrl: './depuracion-usuarios.component.html',
  styleUrls: ['./depuracion-usuarios.component.css']
})
export class DepuracionUsuariosComponent implements OnInit {


  
  @ViewChild(MatTable,{static:false}) usuarioTabla: MatTable<IUsuario>;
  @ViewChild(MatPaginator,{static:false}) paginador: MatPaginator;
  public usuarios: MatTableDataSource<IUsuario> = new MatTableDataSource<IUsuario>([]);

  public columnas = ['foto','nombre','correo','numero','planta','deparamento'];

  public seleccionTipo: FormControl = new FormControl(null);

  public roles = ['superUser','admin','user'];

  public plantas :string[]=[];
  public departamentos: string [] = [];

  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore,
    private firebaseDB: AngularFireDatabase,
    private http: HttpClient,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar
  ) {



   }

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

  private registradosDeHoy(){

    this.firestore.collection<IUsuario>('users', query => query.where('fechaRegistro','==',new Date().toLocaleDateString() ))
    .get().subscribe( documentos =>{
 
     if(!documentos.empty){
 
       this.cargarUsuarios( documentos );
 
     }else{
 
       this.mostrarSnack('No se encontraon usuarios de hoy','snackVerde');
      // console.log('No se encontraron');
     }
 
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
 
       this.mostrarSnack('No se encontro el usuario','snackVerde');
      // console.log('No se encontraron');
     }

  });

}

public buscarPorPlanta(planta:string){

  this.firestore.collection<IUsuario>('users', query => query.where('idPlant','==', planta ))
  .get().subscribe( documentos =>{

   if(!documentos.empty){

     this.cargarUsuarios( documentos );

   }else{

     this.mostrarSnack('No se encontraon usuarios de hoy','snackVerde');
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

     this.mostrarSnack('No se encontraon usuarios de hoy','snackVerde');
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

     this.mostrarSnack('No se encontraon usuarios de hoy','snackVerde');
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

      this.mostrarSnack('No se encontraon usuarios de ese dia','snackVerde');
      //console.log('No se encontraron');
    }

   });

    }else{

      this.mostrarSnack('Fecha no valida','snackRojo');

    }

  

  }




  public eliminarUsuarios(){

    this.matDialog.open( ConfirmarComponent,{
      hasBackdrop:true,
      disableClose:true,
      data:'¿ Estas seguro que quieres depurar los usuarios ?'
      })
      .afterClosed().subscribe(respuesta =>{
  
        if(respuesta){

          this.mostrarCargando('Depurando usuarios y sus reacciones, espere...','depurando');

          this.usuarios.data.forEach( async(usuario) =>{
      
           await this.firestore.doc('users/'+ usuario.id).delete()
            .then( ()=>{


      
            })
            .catch(err =>{
              console.log('Error al elimnar usuario',err);
            })

            //Probar depuracion

         const reacciones =  await this.firestore.collection('reacciones', query => query.where('idUsuario','==', usuario.id ))
            .get()
            .toPromise()
            .then( reaccionesDocs =>reaccionesDocs.docs );

            for await( const reaccion of reacciones){

            await this.firestore.collection('reacciones').doc( reaccion.id).delete()
    
            }
      
          });

         

          this.mostrarSnack('Se eliminaron los usuarios','snackVerde');

          this.cerrarCargando('depurando');

          this.usuarios.data = [];
          this.usuarioTabla.renderRows();
          this.usuarios.paginator = this.paginador;

          
        }
  
  
      });

    



  }

  public gafeteUsuario( numeroEmplpeado:number ):string{


    return `http://148.164.96.4:8080/SanmAPI/getImageUser/?employee=${numeroEmplpeado}`
  }

  public mostrarCargando(mensaje:string ,id:string){

    this.matDialog.open( CargandoComponent,
      {
      hasBackdrop:true,
      disableClose:true,
      data : mensaje,
      id
      });

  }

  private cerrarCargando(id:string){
    this.matDialog.getDialogById(id).close();
  }
  


  private async cargarUsuarios( documentos : QuerySnapshot<IUsuario>){

    this.mostrarCargando('Buscando usuarios inactivos, espere...','inactivos');
     
     this.usuarios.data =[];

     const usuariosEncontrados :IUsuario [] = [];
 
     documentos.forEach( documento =>{
       const usuario: IUsuario = (documento.data() as IUsuario);
       usuario.id = documento.id;
 
       //this.usuarios.data.push( usuario );

       usuariosEncontrados.push( usuario );
     });

     for await( const usuario of usuariosEncontrados){

      await this.estadoDelUsuario( usuario.employeeNumber )
    .then( (resp:any) =>{
      console.log('Resp al verificar al usuario',resp);

      if(resp.data.length == 0)this.usuarios.data.push( usuario );
      
    })
    .catch(err =>{

      console.log('Error al verificar al usuario',err);
    });

      
    }

    if(this.usuarios.data.length == 0){

      this.mostrarSnack('No se encontraron usuarios inactivos','snackVerde');
      
    }else{
      this.mostrarSnack('Se encontraron usuarios inactivos','snackVerde');
      this.usuarioTabla.renderRows();
      this.usuarios.paginator = this.paginador;
    }


    this.cerrarCargando('inactivos');

 
 
   }


  private mostrarSnack(mensaje:string, color:string ){

    this.matSnack.open(mensaje, null,{
      panelClass: color,
      duration: 3000
    });

  }


  private estadoDelUsuario( idEmpleado:number ){
   
    const params = new HttpParams()
    .append('employeeNumber', idEmpleado.toString() );

    return this.http.get(`http://gdl1amwebw03.am.sanm.corp:8080/YildDefect/EmployeeInfo`, { params })
    .toPromise();

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


