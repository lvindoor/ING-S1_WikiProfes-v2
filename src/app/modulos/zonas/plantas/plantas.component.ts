import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../../componentes/confirmar/confirmar.component';
import { CrearDepartamentoComponent } from '../departamentos/crear-departamento/crear-departamento.component';
import { CrearPlantaComponent } from './crear-planta/crear-planta.component';

@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.component.html',
  styleUrls: ['./plantas.component.css']
})
export class PlantasComponent implements OnInit {

  public columnas : string []=['nombre','numero','opc']; 
  public plantas : MatTableDataSource<IPlanta>;

  @ViewChild(MatTable, {static:false}) tabla: MatTable<IPlanta>;

  constructor(
    private firebaseDB: AngularFireDatabase,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar
  ) {

    this.cargarPlantas();
   }

  ngOnInit(): void {

  }

  public eliminarPlanta(index: number){


    this.matDialog.open( ConfirmarComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data:`Estas seguro de borrar la planta ${this.plantas.data[index].name}` 
      })
      .afterClosed()
      .subscribe( resultado =>{


        if(resultado){

          this.firebaseDB.database.ref('departament/'+this.plantas.data[index].key)
          .remove().then( ()=>{


      this.plantas.data.splice(index,1);
      this.tabla.renderRows();

      this.mostrarSnack('Se elimino correctamente','snackVerde');

      })
      .catch(err =>{
        console.log('Error al eliminar el departamento',err);
      });

        }

      })

    


  }

  public editarPlanta( index:number ){

    this.matDialog.open( CrearPlantaComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: this.plantas.data[index]
      } )
      .afterClosed().subscribe( resultado =>{

        if(resultado){
          this.plantas.data[index]= resultado;

          this.tabla.renderRows();
          this.mostrarSnack('Se actualizo correctamente','snackVerde');

        }

        
      });

  }

  private cargarPlantas(){

    this.firebaseDB.database.ref('plant').get()
    .then( deparamentosDocs =>{
  
  
      const plantas:IPlanta []= [];
  
      deparamentosDocs.forEach( departamentoDoc =>{
  
        const departamento: IPlanta = departamentoDoc.toJSON() as any;
  
        departamento.key = departamentoDoc.key;
  
        plantas.push( departamento );
      });
  
  
      this.plantas = new MatTableDataSource(plantas);
  
  
    })
  
  
    }

  public agregarPlanta(){

    this.matDialog.open( CrearPlantaComponent,
      {
        hasBackdrop:true,
        disableClose:true
      } )
      .afterClosed().subscribe( resultado =>{

        if(resultado){

          this.plantas.data.push(resultado);
          this.tabla.renderRows();
          this.mostrarSnack('Se agrego correctamente','snackVerde');

        }

        
      });

  }

  private mostrarSnack(mensaje:string, color:string){

    this.matSnack.open(mensaje, null,
      {
        duration: 3000,
        panelClass: color
      });


  }

}

interface IPlanta{
  key? :string;
  name:string;
  number:string;
}
