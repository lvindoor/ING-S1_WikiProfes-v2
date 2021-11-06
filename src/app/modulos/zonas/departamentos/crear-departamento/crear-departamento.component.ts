import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-departamento',
  templateUrl: './crear-departamento.component.html',
  styleUrls: ['./crear-departamento.component.css']
})
export class CrearDepartamentoComponent implements OnInit {


  public nombre: FormControl ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public departamento:any,
    public matDialogRef: MatDialogRef<CrearDepartamentoComponent>,
    private firebaseDB: AngularFireDatabase
  ) {

    if(departamento){
      this.nombre = new FormControl(departamento.name, [Validators.required, Validators.minLength(4)])
    }else{
      this.nombre =  new FormControl(null, [Validators.required, Validators.minLength(4)]);
    }
    
   }

  ngOnInit(): void {

    console.log('asi llega', this.departamento);

  }


  public guardarDepartamento(){

    if(this.departamento){

      this.firebaseDB.database.ref('departament/'+this.departamento.key)
    .update({ name: this.nombre.value })
    .then( (valor)=>{



      this.matDialogRef.close({ name: this.nombre.value, key: this.departamento.key })

    } )
    .catch( err =>{
      console.log('Error al guardar el departamento',err);
    }) 



    }else{
      this.firebaseDB.database.ref('departament')
    .push({ name: this.nombre.value })
    .then( (valor)=>{



      this.matDialogRef.close({ name: this.nombre.value, key: valor.key })

    } )
    .catch( err =>{
      console.log('Error al guardar el departamento',err);
    })
    }

    


  }





}
