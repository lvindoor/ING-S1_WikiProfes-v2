import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdvancedPieChartComponent } from '@swimlane/ngx-charts';
import { IIngresoNoticia } from 'src/app/modelos/actividadUsuarios';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-ingreso-noticia',
  templateUrl: './ingreso-noticia.component.html',
  styleUrls: ['./ingreso-noticia.component.css']
})
export class IngresoNoticiaComponent implements OnInit {

  public regionales = new FormControl(0);
  public seleccionTipo = new FormControl(0);
  public fechaSeleccionada = new FormControl(null);

  @ViewChild(MatTableModule,{static:false}) ingresosTabla: MatTable<IIngresoNoticia>;
  @ViewChild(MatPaginator,{static:false}) paginador: MatPaginator;
  public ingresos: MatTableDataSource<IIngresoNoticia> = new MatTableDataSource<IIngresoNoticia>([]);

  public columnas = ['foto','nombre','correo','numero','planta','deparamento','regional'];

 public fechaInicio:string = '';
 public fechaFinal:string = '';

 public datosGrafico: IDatosGraficos[]=[];


 colorScheme = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
};

@ViewChild('chart') chart: AdvancedPieChartComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) private  data:any,
    public matDialogRef: MatDialogRef<IngresoNoticiaComponent>,
    private firestore: AngularFirestore,
    private matSnack: MatSnackBar,
    private excel: ExcelService
  ) { }

  ngOnInit(): void {

    this.visitasTotales();

  }

  public descargarExcel(){

    const columnas = [];

    this.usuarioPropiedades.forEach( uPropiedades =>{

      if( uPropiedades.check ){
        columnas.push( uPropiedades.propiedad );
      }

    });


    const usuariosColumnas = [];

    for( let i=0; i< this.ingresos.data.length; i++){

       usuariosColumnas[i] = {};

      columnas.forEach( columna =>{

        usuariosColumnas[i][columna] = this.ingresos.data[i][columna];

      });

    }

     this.excel.exportarAExcel( usuariosColumnas , `${this.tiposBusqudas[ this.seleccionTipo.value] }-${new Date().getMilliseconds()}`);
  }


  public buscarPorFecha(){



    switch(this.regionales.value){

      case 0:

        this.firestore.collection<IIngresoNoticia>('actividadNoticia', query => query
        .where('idNoticia','==', this.data.idNoticia)
        .where('fecha', '>=', this.fechaInicio)
        .where('fecha', '<=', this.fechaFinal)
        ).get().subscribe( documents =>this.cargarIngresos(documents, this.fechaInicio, this.fechaFinal),
        err => console.log('Error al cargar visitias',err));
       
      break;

      case 1:

        this.firestore.collection<IIngresoNoticia>('actividadNoticia', query => query
        .where('idNoticia','==', this.data.idNoticia)
        .where('fecha', '>=', this.fechaInicio)
        .where('fecha', '<=', this.fechaFinal)
        .where('regional', '==', true)
        ).get().subscribe( documents =>this.cargarIngresos(documents, this.fechaInicio, this.fechaFinal),
        err => console.log('Error al cargar visitias',err));

      break;

      case 2:

        this.firestore.collection<IIngresoNoticia>('actividadNoticia', query => query
        .where('idNoticia','==', this.data.idNoticia)
        .where('fecha', '>=', this.fechaInicio)
        .where('fecha', '<=', this.fechaFinal)
        .where('regional', '==', false)
        ).get().subscribe( documents =>this.cargarIngresos(documents, this.fechaInicio, this.fechaFinal),
        err => console.log('Error al cargar visitias',err));
      break;  

    }



  }

  public cargarFecha(inicio:boolean){


    if(inicio){

    const fechaCero = new Date( this.fechaSeleccionada.value);

    fechaCero.setHours(0,0,0,0);


    const fechaNoticia = new Date(this.data.fechaNoticia);

    fechaNoticia.setHours(0,0,0,0);
    

    if( fechaCero >= fechaNoticia ){
      this.fechaInicio = fechaCero.toISOString();
    }else{
      this.mostrarSncak('Fecha incorrecta','snackRojo');
    }


     
    }else{

    const fechaInicio = new Date();


    const fechaFinal = new Date(this.fechaSeleccionada.value);

    
   

    if( fechaFinal <= fechaInicio ){
      this.fechaFinal = fechaFinal.toISOString();

    }else{
      this.mostrarSncak('Fecha incorrecta','snackRojo');
    }

   

    }


    this.fechaSeleccionada.setValue(null);


  }



  private visitasTotales(){






    this.firestore.collection<IIngresoNoticia>('actividadNoticia', query => query
    .where('idNoticia','==', this.data.idNoticia)
    ).get().subscribe( documents =>this.cargarIngresos(documents, this.data.fechaNoticia, new Date().toISOString()),
    err => console.log('Error al cargar visitias',err));

    
  }

  private cargarIngresos( documentos : QuerySnapshot<IIngresoNoticia>, fechaInicio:string, fechaFinal:string){
    
    this.ingresos.data =[];

    const ingresosDocumentos : IIngresoNoticia[] = [];

    if(!documentos.empty){
      documentos.forEach( documento =>{
      const ingreso: IIngresoNoticia = (documento.data() as IIngresoNoticia);
      ingreso.id = documento.id;

      ingresosDocumentos.push(ingreso);

      this.ingresos.data = ingresosDocumentos;
    });



const inicioFecha = new Date(fechaInicio);

const finalFecha = new Date(fechaFinal);

console.log('Fecha final ', finalFecha.toLocaleDateString());

const diferencia = Math.floor( (finalFecha.getTime() - inicioFecha.getTime())/(1000*60*60*24) ) ;

//console.log('Diferencia de dias', diferencia);

const datos : IDatosGraficos[] = [];

for(let i =0; i<diferencia+2; i++){
 // console.log('va en la fecha', inicioFecha.toLocaleDateString() );

    const visitasDia = ingresosDocumentos.filter( ingreso =>{
    
    const fechaUsuario = new Date(ingreso.fecha);

   return fechaUsuario.toLocaleDateString() === inicioFecha.toLocaleDateString(); 
  
  });

  //console.log('las fechas y sus visitias', visitasDia.length);  

  if( visitasDia.length > 0 ){
  datos.push({
      name : inicioFecha.toLocaleDateString(),
      value: visitasDia.length
    });
  }


  inicioFecha.setDate( inicioFecha.getDate() +1);

}

this.datosGrafico =  datos;

console.log('Se cargaron la estadistica', this.datosGrafico);
//Que pedo con la grafica

// this.chart.data = this.datosGrafico;
// this.chart.update();

// this.chart.


    this.ingresos.paginator = this.paginador;
    }else{
      this.mostrarSncak('No se encontraon usuarios','snackVerde');
    }

    

  }

  private mostrarSncak(mensaje: string, color:string){

    this.matSnack.open(mensaje, null, {
      panelClass: color,
      duration: 3000
    });


  }



  public busquedaTipo( index:number){

    switch( index ){

      case 0: this.visitasTotales();
      break;

      // case 1: this.noAutorizados();
      // break;

      // case 4: this.cargarPlantas();
      // break;
      
      // case 5: this.cargarDepartamentos();
      // break;
      
      // case 7: this.cargarTodosUsuarios();
      // break;


    }


  }

  public tiposBusqudas = [
    'Total de visitas',
    'Rango de fecha'
  ];

  public usuarioPropiedades =[
    {
      nombre:'Correo',
      check:true,
      propiedad:'email'
    },
    {
      nombre:'Numero de emepleado',
      check :true,
      propiedad:'employeeNumber'
    },
    {
      nombre:'Nombre',
      check:true,
      propiedad: 'fullName'
    },
    {
      nombre:'Departamento',
      check:true,
      propiedad: 'idDepartment'
    },
    {
      nombre:'Planta',
      check:true,
      propiedad: 'idPlant'
    },

    {
      nombre:'Regional',
      check:true,
      propiedad: 'regional'
    }
  ];




  public regionalesFiltro=[
    'Ambos',
    'Regionales',
    'No regionales'
  ];


}

interface IDatosGraficos{
  name:string;
  value: number
}