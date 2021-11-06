import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  
  constructor(
    private updates: SwUpdate
  
  ){


   this.updates.available.subscribe( () =>{
      
      document.location.reload();

      console.log('Hay una version del Service Worker nueva y se actualiza');
   }); 





  }


  ngOnInit(){


    
  }

  

}
