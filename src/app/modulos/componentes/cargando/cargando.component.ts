import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.css']
})
export class CargandoComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA ) public mensaje:string
  ) { }

  ngOnInit(): void {
    
  }

}
