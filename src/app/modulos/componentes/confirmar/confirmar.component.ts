import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public mensaje:string,
    private matDialogRef: MatDialogRef<ConfirmarComponent>
  ) { 

  }

  ngOnInit(): void {

  }


  public cerrarModal( resultado:boolean = false){

    this.matDialogRef.close( resultado );

  }

}
