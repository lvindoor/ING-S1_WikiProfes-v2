import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxOneSignalModule } from 'ngx-onesignal';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';







@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp( environment.firebaseKeys ),
    AngularFireAuthModule,
    ServiceWorkerModule.register('OneSignalSDKWorker.js', { enabled: environment.production }),
    NgxOneSignalModule.forRoot({
      appId: '7852c893-cb4f-4643-ab53-7792a8c12e64',
      autoRegister:false,
      notifyButton: {
        enabled: false,
        },
        
    }),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
