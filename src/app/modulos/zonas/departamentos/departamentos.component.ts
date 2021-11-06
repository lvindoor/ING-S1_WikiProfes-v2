import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../componentes/confirmar/confirmar.component';
import { CrearDepartamentoComponent } from './crear-departamento/crear-departamento.component';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {

  public columnas : string []=['nombre','opc']; 
  public departamentos : MatTableDataSource<IDepartamento>;

  @ViewChild(MatTable, {static:false}) tabla: MatTable<IDepartamento>;

  constructor(
    private firebaseDB: AngularFireDatabase,
    private matDialog: MatDialog,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.cargarDepartamentos();


  }

  public eliminarDepartamento(index: number){


    this.matDialog.open( ConfirmarComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data:`Estas seguro de borrar el departamento ${this.departamentos.data[index].name}` 
      })
      .afterClosed()
      .subscribe( resultado =>{


        if(resultado){

          this.firebaseDB.database.ref('departament/'+this.departamentos.data[index].key)
          .remove().then( ()=>{


      this.departamentos.data.splice(index,1);
      this.tabla.renderRows();

      this.mostrarSnack('Se elimino correctamente','snackVerde');

      })
      .catch(err =>{
        console.log('Error al eliminar el departamento',err);
      });

        }

      })

    


  }

  public agregarDepartamento(){

    this.matDialog.open( CrearDepartamentoComponent,
      {
        hasBackdrop:true,
        disableClose:true
      } )
      .afterClosed().subscribe( resultado =>{

        if(resultado){

          this.departamentos.data.push(resultado);
          this.tabla.renderRows();
          this.mostrarSnack('Se agrego correctamente','snackVerde');

        }

        
      });

  }

  public editarDepartamento( index:number ){

    this.matDialog.open( CrearDepartamentoComponent,
      {
        hasBackdrop:true,
        disableClose:true,
        data: this.departamentos.data[index]
      } )
      .afterClosed().subscribe( resultado =>{

        if(resultado){
          this.departamentos.data[index]= resultado;

          this.tabla.renderRows();
          this.mostrarSnack('Se actualizo correctamente','snackVerde');

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


  private cargarDepartamentos(){

  this.firebaseDB.database.ref('departament').get()
  .then( deparamentosDocs =>{


    const departamentos:IDepartamento []= [];

    deparamentosDocs.forEach( departamentoDoc =>{

      const departamento: IDepartamento = departamentoDoc.toJSON() as any;

      departamento.key = departamentoDoc.key;

      departamentos.push( departamento );
    });


    this.departamentos = new MatTableDataSource(departamentos);


  })


  }

}

interface IDepartamento{
  name:string;
  key?: string;
}
