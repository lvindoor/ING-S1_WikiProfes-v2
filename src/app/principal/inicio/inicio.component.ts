import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IComentario } from 'src/app/modelos/comentario';
import { IMaestro } from 'src/app/modelos/maestro';
import { MALAS_PALABRAS } from './comentarios.json';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public comentarios : IComentario[];
  public maestros : string[] = []; 
  
  malasPalabras: string[] = [];
  palabra: string = "";
  comentarioCensurado: string = "";
    

  constructor(private firestore : AngularFirestore) {

    /* Cargamos Maestros */
    this.firestore.collection('profesores').valueChanges().subscribe(profesores => {

      if(profesores != null) {

        profesores.forEach( (maestro) => {

          const profesor : IMaestro = (maestro as any);
          this.maestros.push( profesor.nombre );         

        });
      } 

    });

    console.log('Se cargaron los maestros en: ', this.maestros);

    this.malasPalabras = MALAS_PALABRAS;
   }

  ngOnInit(): void {}

  public cambioMaestro( nombreMaestro : string ) {
    
    this.comentarios = [];

    console.log('Maestro', nombreMaestro);

    this.firestore.collection<IComentario>('comentarios', query =>
    query
    .where('nombreMaestro','==', nombreMaestro)
    )
    .get()
    .subscribe( documentos =>{

        if(!documentos.empty){


          documentos.forEach( (documento) =>{

            const comentario : IComentario = documento.data();
            comentario.key = documento.id;

            this.comentarios.push( comentario );

          });

          console.log('Se cargaron los comentarios', this.comentarios);

        }

    },err =>{
      console.log('Error al cargar los comentarios', err);
    });

  } 
  
  revisar(palabra: string, malasPalabras: string[]): string{
    for(let i = 0; i < malasPalabras.length; i++) {
      if(malasPalabras[i] == palabra){
          return "***";
      }
    }
    return palabra;
  }

  censurar(comentario: string): string{
    this.palabra = "";
    this.comentarioCensurado = "";

    for(let i = 0; i < comentario.length; i++){
        if(comentario[i] != ' ' && comentario[i] != '\n' && comentario[i] != ','){
          this.palabra += comentario[i];
          if(i == comentario.length - 1){
              comentario += "\n";
          }
        }else{
          
          if(this.palabra.length != 0){
            this.palabra = this.revisar(this.palabra, this.malasPalabras);
            this.comentarioCensurado += this.palabra + " ";
          }
          this.palabra = "";
        }
    }
    return this.comentarioCensurado;
  }

}

