import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vistas-zonas',
  templateUrl: './vistas-zonas.component.html',
  styleUrls: ['./vistas-zonas.component.css']
})
export class VistasZonasComponent implements OnInit {


  public columnas:string [] = ['nombre','activo'];

  
  public zonas: MatTableDataSource<IZona> = new MatTableDataSource<IZona>([]);


  @ViewChild(MatTable ,{ static:false }) zonasTabla: MatTable<IZona>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public matDialogRef: MatDialogRef<VistasZonasComponent>,
    private auth: AuthService,
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar
  ) {




   }

  ngOnInit(): void {

    // console.log('Estado el usuario', this.auth.usuario);

    this.cargarTabla();




    // this.zonasTabla.renderRows();

  }

  public activar( zonaIndex: number , activo:boolean  ){
    this.zonas.data[zonaIndex].activo = activo;
  }


  public agregarCategorias(){

  const zonasSeleccionadas =  this.zonas.data.filter( zona => zona.activo ).map( zona => zona.nombre);

  console.log('Zonas seleccionadas', zonasSeleccionadas);

  this.firestore.collection('users').doc(this.auth.usuario.id)
  .update( { [this.data.propiedadNombre] : zonasSeleccionadas })
  .then(()=>{

      this.mostrarSnack('Se guardo correctamente','snackVerde');

      this.auth.usuario[ this.data.propiedadNombre ] = zonasSeleccionadas;

      console.log('Estado el usuario', this.auth.usuario);

      this.matDialogRef.close();

  })
  .catch(err =>{
    console.log('error AL agregar vistas',err);
    this.mostrarSnack('No se pudo guardar','snackRojo');
  })



  }

  private mostrarSnack(message:string, color:string){

    this.matSnack.open( message, null, {
      duration: 3000,
      panelClass: color
    });

  }


  private cargarTabla(){



      //console.log('sdffs',this.auth.usuario.departamentosCategorias && this.data.propiedadNombre == 'plantasCategorias' );


    if( this.auth.usuario.plantasCategorias &&  this.data.propiedadNombre == 'plantasCategorias'  )
    {


      (this.data.plantas as Array<string>).forEach( planta =>{
        

        if( this.auth.usuario.plantasCategorias.includes( planta ) ){
          this.zonas.data.push({ nombre : planta , activo :true });
        
        }else{
          this.zonas.data.push({ nombre : planta , activo :false });
        }

      });


    }
   else if( this.auth.usuario.departamentosCategorias && this.data.propiedadNombre == 'departamentosCategorias'){

      (this.data.departamentos as Array<string>).forEach( departamento =>{

        if( this.auth.usuario.departamentosCategorias.includes( departamento ) ){
          this.zonas.data.push({ nombre : departamento , activo :true });
        }else{
          this.zonas.data.push({ nombre : departamento , activo :false });
        }

      });

    }
    else if(this.data.propiedadNombre == 'plantasCategorias'){

      (this.data.plantas as Array<string>).forEach( planta => {
        
        this.zonas.data.push( {nombre: planta, activo: false});

        

      });

    }else{
      
      (this.data.departamentos as Array<string>).forEach( departamento => {
        
        this.zonas.data.push( {nombre: departamento, activo: false});

      });
    }



  }

}

interface IZona{
  nombre: string;
  activo:boolean;
}
