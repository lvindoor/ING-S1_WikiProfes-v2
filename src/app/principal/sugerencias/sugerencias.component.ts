import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent {

  private httpClient: HttpClient
  private destinatario: string;

  constructor() {
    this.destinatario = "https://formsubmit.co/wikiprofes2.0@gmail.com";
  } 

  submit(form) {
   if (form.valid)
     this.httpClient.post(this.destinatario,form.value)
         .subscribe(res=>console.log(res));
  }

}
