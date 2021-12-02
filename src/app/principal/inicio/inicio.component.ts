import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public filtros : string[] = [ "Conocimiento", "Puntualidad", "Promedio", "Dificultad"];
  
  malasPalabras: string[] = [];
  palabra: string = "";
  comentarioCensurado: string = "";
  maestroActual : number = 0;
    

  constructor(private firestore : AngularFirestore, private matSnack: MatSnackBar) {

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
    this.maestroActual = this.maestros.findIndex(m => m === nombreMaestro);

    console.log('Maestro', nombreMaestro);

    this.firestore.collection<IComentario>('comentarios', query =>
      query.where('nombreMaestro','==', nombreMaestro).orderBy('fechaComentario','desc')
    )
    .get()
    .subscribe( documentos =>{

        if(!documentos.empty) {


          documentos.forEach( (documento) =>{

            const comentario : IComentario = documento.data();
            comentario.key = documento.id;

            let esRepetido = false;

            for(let c of this.comentarios) {
              if(c.key === comentario.key) {
                esRepetido = true;
              } 
            } 

            if(!esRepetido) {
              this.comentarios.push( comentario );
            }             

          });

          console.log('Se cargaron los comentarios', this.comentarios);
          this.mostrarSncak("Se Cargo: " + this.comentarios.length + " comentario(s)", "snackVerde");

        }

    },err =>{
      console.log('Error al cargar los comentarios', err);
    });
  } 

  private mostrarSncak(mensaje: string, color:string){

    this.matSnack.open(mensaje, null, {
      panelClass: color,
      duration: 3000
    });

  }

  revisar(palabra: string, malasPalabras: string[]): string{
    for(let i = 0; i < malasPalabras.length; i++) {
      let palabraMinuscula = palabra;
      if(malasPalabras[i] == palabraMinuscula.toLowerCase()){
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