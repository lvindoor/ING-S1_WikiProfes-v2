import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-categoria-modal',
  templateUrl: './categoria-modal.component.html',
  styleUrls: ['./categoria-modal.component.css']
})
export class CategoriaModalComponent implements OnInit {


  public nombre: FormControl= new FormControl(null, Validators.required);


  constructor(
    public matDialogReg: MatDialogRef<CategoriaModalComponent>,
    private firebaseDB: AngularFireDatabase
  ) {

   }

  ngOnInit(): void {

  }

  public guardarCategoria(){

    this.firebaseDB.list('/category').push({
      name: this.nombre.value,
      status: false
    })
    .then( (resp) =>{
      //console.log('Se hizo la incesrcion',resp.key);
      this.matDialogReg.close({
        key: resp.key,
        name: this.nombre.value,
        status:false
      })
    })
    .catch( err =>{
      //console.log('Error al guardar',err);
    });


  }

}
