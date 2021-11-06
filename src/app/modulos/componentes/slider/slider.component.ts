
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Slide } from "./slider.interface";
import { trigger, transition, useAnimation } from "@angular/animations";

import {
  AnimationType,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  flipIn,
  flipOut,
  jackIn,
  jackOut
} from "./slider.animations";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [
    trigger("slideAnimation", [
      /* scale */
      transition("void => scale", [
        useAnimation(scaleIn, { params: { time: "500ms" } })
      ]),
      transition("scale => void", [
        useAnimation(scaleOut, { params: { time: "500ms" } })
      ]),

      /* fade */
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "500ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "500ms" } })
      ]),

      /* flip */
      transition("void => flip", [
        useAnimation(flipIn, { params: { time: "500ms" } })
      ]),
      transition("flip => void", [
        useAnimation(flipOut, { params: { time: "500ms" } })
      ]),

      /* JackInTheBox */
      transition("void => jackInTheBox", [
        useAnimation(jackIn, { params: { time: "700ms" } })
      ]),
      transition("jackInTheBox => void", [
        useAnimation(jackOut, { params: { time: "700ms" } })
      ])
    ])
  ]
})
export class SliderComponent implements OnInit {


  @Input() slides: Slide[]=[];
  // public slides: Slide[] = [];

  @Input() cargarImagenes: boolean;

  public animationType = AnimationType.Scale;

  currentSlide = 0;


  public imagenAmpliada :boolean =false;

  constructor() { }

  ngOnInit(): void {

    if( this.cargarImagenes){
      this.preloadImages();
    }
    
  }


  public agregarSlide( slide:Slide){


    this.slides.push( slide );
    if(this.slides.length === 1){
      this.currentSlide = 0;
    }



  }


  public imageZoom(){
    this.imagenAmpliada = !this.imagenAmpliada;
  }

  public eliminarMultimediaIndex( index:number ){

    this.slides.splice(index,1);
    this.onPreviousClick();


  }

  public elminarMultimedia(){
    this.slides = [];
    this.currentSlide = 1;

   
  }  

  onPreviousClick() {

    //console.log( this.currentSlide );
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    //console.log("previous clicked, new current slide is: ", this.currentSlide);
  }

  onNextClick() {

    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
   // console.log("next clicked, new current slide is: ", this.currentSlide);
  }

 
  preloadImages() {

      for (const slide of this.slides) {

        if( slide.tipo == 'image'){

        new Image().src = this.crearUrlImg( slide.src );

        }


      }
    
  }

  public crearUrlImg(id: string): string{

    if( id.length<25){
      return `https://res.cloudinary.com/dlor7n05z/image/upload/v1607017792/noticias/${id}`
    }else{
      return id;
    }

    
  }
  
  public crearUrlVideo(id: string): string{

    if(id.length<25 ){
      return `https://res.cloudinary.com/dlor7n05z/video/upload/v1607017792/noticias/${id}`
    }else{
      return id;
    }
  
    
  }

}
