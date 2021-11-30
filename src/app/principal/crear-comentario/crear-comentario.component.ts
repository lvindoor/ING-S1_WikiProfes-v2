import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IComentario } from 'src/app/modelos/comentario';
import { AuthService } from 'src/app/servicios/auth.service';
import { CargandoComponent } from '../cargando/cargando.component';

@Component({
  selector: 'app-crear-comentario',
  templateUrl: './crear-comentario.component.html',
  styleUrls: ['./crear-comentario.component.css']
})
export class CrearComentarioComponent implements OnInit {

  public comentarioForm: FormGroup;

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private matSnack: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.cargarForm();
  }


  public materias = ['Español','Matematicas','Ingles','Progamacion'];

  public planteles = ['pl1','pl2','pl3','pl4'];

  public claves = ['dasasd','fdfsdf','dfgdfgdfg'];

  public maestros : string[] = [ 'RODRIGUEZ FELIX', 'DAVALOS BOITES', 'HERNANDEZ ALFREDO', 'MUÑOZ LUIS ALBERTO'];


  public mostrarCargando(mensaje:string){

    this.matDialog.open( CargandoComponent,
      {
        id:'cargando',
        data:mensaje,
        disableClose:false,
        hasBackdrop:true
      });

  }

  public mostrarSnack(messge:string, color:string){

    this.matSnack.open(messge,null,{
      duration:3000,
      panelClass:color
    });

  }

  public async crearComentario(){

      this.mostrarCargando("Guardando comentario, espere...");

    const nuevoComanterio : IComentario ={
      autor : this.auth.usuario,
      calificacion: this.comentarioForm.value.calificacion,
      clave: this.comentarioForm.value.clave,
      comentario: this.comentarioForm.value.comentario,
      conocimiento: this.comentarioForm.value.conocimiento,
      dificultad: this.comentarioForm.value.dificultad,
      materia: this.comentarioForm.value.materia,
      nombreMaestro :this.comentarioForm.value.nombreMaestro,
      plantel: this.comentarioForm.value.plantel,
      puntualidad: this.comentarioForm.value.puntualidad,
      tituloComentario: this.comentarioForm.value.comentario
    };

    try{

    await this.firestore.collection('comentarios').add( nuevoComanterio );

    this.matDialog.getDialogById('cargando').close();

    this.mostrarSnack('Se guardo correctamente','snackVerde');


    this.comentarioForm.reset({
      nombreMaestro  : null,
      materia : null,
      plantel : null,
      clave : null,
      conocimiento : null,
      puntualidad : null,
      dificultad : null,
      calificacion : null,
      titulo : null,
      comentario : null,
    })

    }catch(err){
      console.log("error al guardar comentario ",err);

      this.mostrarSnack('Error al guardar comentario','snackRojo');
    }
    
  




  }


  private cargarForm(){


    this.comentarioForm = new FormGroup({
      nombreMaestro : new FormControl(null, Validators.required),
      materia: new FormControl(null, Validators.required),
      plantel: new FormControl(null, Validators.required),
      clave: new FormControl(null, Validators.required),
      conocimiento:new FormControl(null, Validators.required),
      puntualidad: new FormControl(null, Validators.required),
      dificultad : new FormControl(null, Validators.required),
      calificacion: new FormControl(null, Validators.required),
      titulo: new FormControl(null, Validators.required),
      comentario: new FormControl(null, Validators.required)
    });


    


  }

}
