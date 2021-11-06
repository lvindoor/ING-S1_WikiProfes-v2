import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA ) public data:any,
    private matdialogRef: MatDialogRef<AlertaComponent> 
  ) { }

  ngOnInit(): void {

  }

  public cerrarModal(){
    this.matdialogRef.close();
  }

}
