import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IComentario } from 'src/app/modelos/comentario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public comentarios : IComentario[];
  public maestros : string[] = [ 'RODRIGUEZ FELIX', 'DAVALOS BOITES', 'HERNANDEZ ALFREDO', 'MUÑOZ LUIS ALBERTO'];

  constructor(private firestore : AngularFirestore) {

    this.cambioMaestro( this.maestros[0] ); 
   }

  ngOnInit(): void { 



   }

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

}
