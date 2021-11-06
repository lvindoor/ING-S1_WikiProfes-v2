import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-numero-empleado',
  templateUrl: './numero-empleado.component.html',
  styleUrls: ['./numero-empleado.component.css']
})
export class NumeroEmpleadoComponent implements OnInit {


  public numeroEmpleado: FormControl;
  


  constructor(
    private auth: AuthService,
    public matDialogRef: MatDialogRef<NumeroEmpleadoComponent>,
    private firestore: AngularFirestore
  ) { 

  }



  ngOnInit(): void {

    this.numeroEmpleado = new FormControl(this.auth.usuario.employeeNumber,[ Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]*$') ], this.correoUnico.bind(this) );


  }


  public actualizarNumero(){

    this.firestore.collection('users').doc(this.auth.usuario.id)
    .update({employeeNumber : this.numeroEmpleado.value})
    .then( ()=>{

      this.auth.usuario.employeeNumber = this.numeroEmpleado.value;
      this.matDialogRef.close();

    })
    .catch( err =>{
      console.log('Error al guardar el numero ',err);
    })

  }


  private correoUnico(control: AbstractControl) : Promise<ValidationErrors | null> | null {

    
    return new Promise( (resolve, reject) =>{

      this.firestore.collection('users', query => query.where('employeeNumber','==', this.numeroEmpleado.value))
      
      .get().subscribe( usuario =>{

        if(!usuario.empty){
          resolve({existe:true});
        }else{
          resolve(null);
        }

  
      })

      
    });
  
  }

}
