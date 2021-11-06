import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INew } from 'src/app/modelos/noticia';
import { AuthService } from 'src/app/services/auth.service';

import {IReaccion} from 'src/app/modelos/reaccion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IIngresoNoticia } from 'src/app/modelos/actividadUsuarios';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {

  single: IDatosGraficos[]=[];
  view: any[] = [600, 350];

  // options
  gradient: boolean = true;
  //showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public respuestasNoticia :string[] = [];


  public reaccionNoticia: IReaccion;
  public respuestaIndex:number =null;

  public reaccionando :boolean = true;

  public imagenAmpliada :boolean =false;



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IData,
    public matDialogRef: MatDialogRef<NoticiaComponent>,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private matSnack:MatSnackBar
  ) { 


    if(window.innerWidth < 1000 ){
      this.view = [350, 250];
    }

      if(this.data.noticia.encuesta.length > 0){

        this.respuestasNoticia = this.data.noticia.encuesta;
        
        this.data.noticia.encuesta.forEach( campo =>{

          const numeroReacciones = this.data.reacciones.filter( reaccionC => reaccionC.reaccion == campo ).length;
    
          this.single.push({
            name: campo,
            value: numeroReacciones
          });
    
        });

      }else{

        this.respuestasNoticia = ['Me gusta','No me gusta']


      }

   

    //console.log('Asi llega la noticia ', this.data.noticia);
 


    this.firestore.collection<IReaccion>('reacciones', query=> 
    query.where('idNoticia','==', this.data.noticia.id)
    .where('idUsuario','==', this.auth.usuario.id)
    )
    .get().subscribe( nodos =>{

      if( nodos.empty ){
       // console.log('No ha reaccionado a la noticia');

        
      }else{

        
        nodos.forEach( reaccion =>{

          const reaccionado = reaccion.data();
          reaccionado.id = reaccion.id;
          this.reaccionNoticia = reaccionado;

         

        });

          this.respuestaIndex = this.respuestasNoticia.indexOf( this.reaccionNoticia.reaccion );

       // console.log('Ya ha reaccionado a la noticia', this.reaccionNoticia);

      }

        this.reaccionando =false;

    })

  }


  ngOnInit(): void {

    this.ingresoNoticia();
  

  }


  private async ingresoNoticia(){


   const ingresoNoticia = await this.firestore.collection('actividadNoticia', query => query
    .where('employeeNumber','==', this.auth.usuario.employeeNumber)
    .where('idNoticia','==', this.data.noticia.id)
    ).get().toPromise();


    if(ingresoNoticia.empty){

      const ingreso : IIngresoNoticia={
        idDepartment: this.auth.usuario.idDepartment,
        fecha : new Date().toISOString(),
        idPlant: this.auth.usuario.idPlant,
        regional: this.auth.usuario.regional,
        fullName: this.auth.usuario.fullName,
        employeeNumber: this.auth.usuario.employeeNumber,
        email: this.auth.usuario.email,
        idNoticia: this.data.noticia.id,
        idRole:  this.auth.usuario.idRole,
        image:  this.auth.usuario.image
      };
  
  
      this.firestore.collection('actividadNoticia').add(ingreso)
      .then(()=> console.log('Se guardo el ingreso a la noticia'))
      .catch( err => console.log('Error al guardar el ingreso de la notcia',err));

    }



  }

  public noticiaWidth(){
    return window.innerWidth > 1000 ? '650px' : '100%';
  }

  

  public imageZoom(){
    this.imagenAmpliada = !this.imagenAmpliada;
  }




  public abrirLink( link:string ){

    const a = document.createElement('a');
    a.target='_blank';
    a.href= link;
    a.click();
    a.remove();

  }

  public opcionEcuesta( index:number ){


    if( this.respuestaIndex ==null ){
      //console.log('Se tiene que crear la reaccion');
      this.respuestaIndex = index;
      this.reaccionarNoticia( this.respuestasNoticia[index] );
    }

    else if( this.respuestaIndex == index){
      //console.log('Eligio el mismo');
      this.respuestaIndex = null;
      this.eliminarReaccion()
    }
    
   else if( this.respuestaIndex != index ){
      this.respuestaIndex = index;
      this.actualizarReaccion(this.respuestasNoticia[index])
      //console.log('Se tiene que actualizar la reaccion');

    }



    //console.log('Eligio la opcion ', this.data.noticia.encuesta[ index ]);

  }

  public noMeGusta( reaccion :string ):boolean{
    return reaccion == 'No me gusta';
  }

  public dosReacciones( reaccion:string ): boolean{
  return reaccion == 'No me gusta' || reaccion ==  'Me gusta';    

  }


  public async compartirNoticia(){

  
    if( navigator.share){

      const noticiaCompartida:ShareData ={
        title: this.data.noticia.title,
        text: this.data.noticia.description,
        url: 'https://sanminanewsapp.web.app/inicio/noticias/'+this.data.noticia.id
      }

     await navigator.share( noticiaCompartida );

    }else{

     await navigator.clipboard.writeText('https://sanminanewsapp.web.app/inicio/noticias/'+this.data.noticia.id);

    this.mostrarSnack('Se copio el link correctamente','snackVerde');

    }

  }

  public eliminarReaccion(  ){

    this.reaccionando = true;

    this.firestore.doc('reacciones/'+this.reaccionNoticia.id)
    .delete()
    .then( ()=>{
      this.reaccionando =false;
      this.reaccionNoticia = null;
      //console.log('Se elimino la reaccion');
    })
    .catch( err =>{

      if( this.data.noticia.encuesta.length > 0){
        this.respuestaIndex = this.data.noticia.encuesta.indexOf( this.reaccionNoticia.reaccion );
      }
      this.reaccionando =false;
      console.log('Error al eliminar la reaccion ',err);
    })
    

  }

  public actualizarReaccion(reaccion:string){

    this.reaccionando = true;


    this.firestore.doc('reacciones/'+this.reaccionNoticia.id)
    .update({reaccion})
    .then( () =>{

      //console.log('Se actualizo la reaccion');

     

      this.reaccionNoticia.reaccion = reaccion;

      this.reaccionando =false;
    })
    .catch( err =>{

      if( this.data.noticia.encuesta.length > 0){
        this.respuestaIndex = this.data.noticia.encuesta.indexOf( this.reaccionNoticia.reaccion );
      }
      this.reaccionando =false;
      console.log('Error al actualizar la reaccion',err);
    })


  }

  public reaccionarNoticia(reaccion:string){

    this.reaccionando = true;

    const reaccionNew:IReaccion={
    reaccion: reaccion,
    idNoticia: this.data.noticia.id,
    idUsuario: this.auth.usuario.id,
    usuario:{
       nombre: this.auth.usuario.fullName,
       img: this.auth.usuario.image
    }  
    };

    this.firestore.collection<IReaccion>('reacciones').add( reaccionNew )
    .then( (documento)=>{
      //console.log('Se realizo la reccion');
      this.reaccionNoticia = reaccionNew;
      this.reaccionNoticia.id = documento.id;

   
      
      this.reaccionando =false;

    })
    .catch( err =>{

      this.reaccionando =false;

      this.respuestaIndex = null;
      console.log('Error al hacer la reaccion',err);
    })

  }

  public mostrarSnack(mensaje:string, color:string){

    this.matSnack.open(mensaje, null,{
     panelClass:color,
     duration: 3000 
    });

  }
 

  public crearUrlImg(id: string): string{

    return `https://res.cloudinary.com/dlor7n05z/image/upload/v1607017792/noticias/${id}`
  }
  
  public crearUrlVideo(id: string): string{
  
    return `https://res.cloudinary.com/dlor7n05z/video/upload/v1607017792/noticias/${id}`
  }

}

interface IData{
  noticia: INew;
  reacciones?: IReaccion[];
}


interface IDatosGraficos{
  name:string;
  value: number
}
