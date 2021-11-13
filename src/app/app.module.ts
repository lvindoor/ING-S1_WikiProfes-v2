import { environment } from 'src/environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/* Librerias de Firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    
    /* Importaciones de Firebase */
    BrowserModule,
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    AngularFireAuthModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
