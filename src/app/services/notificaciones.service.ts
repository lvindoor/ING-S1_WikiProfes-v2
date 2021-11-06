import { Injectable} from '@angular/core';

import { OneSignalService } from 'ngx-onesignal';




@Injectable({
  providedIn: 'root'
})
export class NotificacionesService  {


  constructor( 
    public readonly onesignal: OneSignalService
    ) { 

   
    (window as any).ngxOnesignal = this.onesignal;
    

  }

  public desuscribirse(){
    this.onesignal.unsubscribe();
  }
  





  




  
}
