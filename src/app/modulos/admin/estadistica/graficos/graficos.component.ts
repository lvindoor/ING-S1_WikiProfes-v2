import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { INew } from 'src/app/modelos/noticia';
import { IReaccion } from 'src/app/modelos/reaccion';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  single: IDatosGraficos[]=[];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  public reacciones: MatTableDataSource<IReaccion>= new MatTableDataSource<IReaccion>(this.datos.reacciones);
  public columnas:string []= ['img','nombre'];
  
  public respuestasNoticia :string[] = [];
  
  @ViewChild(MatTable,{static: false}) tablaReacciones: MatTable<IReaccion>;
  @ViewChild(MatPaginator,{static:false}) paginador: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: IEstadistica,
    public matDialogRef: MatDialogRef<GraficosComponent>
  ) { 



  }

  ngOnInit(): void {

    //Para que el filtro funcione para la reaccion

    this.reacciones.filterPredicate = (data: IReaccion, filter: string) => {
      return data.reaccion == filter;
     };

     if(this.datos.noticia.encuesta.length > 0){

      this.respuestasNoticia = this.datos.noticia.encuesta;
      
    }else{

      this.respuestasNoticia = ['Me gusta','No me gusta']

    }

    this.respuestasNoticia.forEach( campo =>{

      const numeroReacciones = this.datos.reacciones.filter( reaccionC => reaccionC.reaccion == campo ).length;

      this.single.push({
        name: campo,
        value: numeroReacciones
      });

    });



    this.reacciones.paginator = this.paginador;

    this.filtrarReaccion( this.respuestasNoticia[0].trim());

    //console.log('Asi queda el filtro al inicar', this.reacciones.filter);
   

  }


  public filtrarReaccion( reaccion:string ){

    
    this.reacciones.filter = reaccion.trim();

    this.reacciones.paginator = this.paginador;

  }


}

interface IEstadistica{
  reacciones: IReaccion[];
  noticia:INew;
}

interface IDatosGraficos{
  name:string;
  value: number
}

