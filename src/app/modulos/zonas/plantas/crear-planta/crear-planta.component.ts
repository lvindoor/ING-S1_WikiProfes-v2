import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-planta',
  templateUrl: './crear-planta.component.html',
  styleUrls: ['./crear-planta.component.css']
})
export class CrearPlantaComponent implements OnInit {

  public plantaForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public planta:any,
    public matDialogRef: MatDialogRef<CrearPlantaComponent>,
    private firebaseDB: AngularFireDatabase
  ) { }

  ngOnInit(): void {

    this.cargarForm();

  }

  public guardarDepartamento(){

    if(this.planta){

      this.firebaseDB.database.ref('departament/'+this.planta.key)
    .update({ name: this.plantaForm.value.name, number: this.plantaForm.value.number })
    .then( (valor)=>{



      this.matDialogRef.close({ 
        name: this.plantaForm.value.name,
        number: this.plantaForm.value.number,
        key: this.planta.key 
        })

    } )
    .catch( err =>{
      console.log('Error al guardar el departamento',err);
    }) 



    }else{
      this.firebaseDB.database.ref('departament')
    .push({ name: this.plantaForm.value.name, number: this.plantaForm.value.number })
    .then( (valor)=>{



      this.matDialogRef.close({ 
        name: this.plantaForm.value.name,
        number: this.plantaForm.value.number,
        key: valor.key
        })

    } )
    .catch( err =>{
      console.log('Error al guardar el departamento',err);
    })
    }

    


  }

  private cargarForm(){

    if( this.planta){
      this.plantaForm = new FormGroup({
        name: new FormControl(this.planta.name, [Validators.required, Validators.minLength(5)]),
        number: new FormControl(this.planta.number, Validators.required)
      });

    }else{
      this.plantaForm = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
        number: new FormControl(null, Validators.required)
      });
    }

    

  }

}
