import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUsuario } from 'src/app/modelos/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaComponent } from '../../componentes/alerta/alerta.component';
import { CargandoComponent } from '../../componentes/cargando/cargando.component';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public registroForm: FormGroup;
  
  public userGoogle: any;
  public plantas: string[]=[];
  public departamentos: string[]=[];

  constructor(
    private firebaseDB: AngularFireDatabase,
    private firestore: AngularFirestore,
    private matDialog: MatDialog,
    private auth: AuthService,
    private matSnack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.cargarFormulario();



    

    this.auth.afAuth.getRedirectResult().then( (usuario) =>{

      if(usuario.user){

        this.mostrarCargando('Verificando datos del usuario','sesion');

        this.firestore.collection<IUsuario>('/users', ref => ref.limit(1).where( 'email', '==', usuario.user.email ))
    .get().subscribe( querySnapshot =>{
  
      if( querySnapshot.empty ){

       this.userGoogle = usuario;
       this.cargarZonas();

      }else{
      
        this.mostrarAlerta('Ya estas registrado, Inicia sesion', 'err');
      
      }
      this.matDialog.getDialogById('sesion').close();
     
    } ,err =>{
      this.matDialog.getDialogById('sesion').close();

    });

     
      }

     

    });


    

  }

  private numeroUnico(control: AbstractControl) : Promise<ValidationErrors | null> | null {

    
    return new Promise( (resolve, reject) =>{

      this.firestore.collection('users', query => query.where('employeeNumber','==', control.value ))
      
      .get().subscribe( usuario =>{

        if(!usuario.empty){
          resolve({existe:true});
        }else{
          resolve(null);
        }

  
      })

      
    });
  
  }


  

  public registrarUsuario(){

    this.mostrarCargando('Registrando usuario, espere...','registro');

 
    const usuario:IUsuario ={
      employeeNumber: this.registroForm.value.employeeNumber,
      email: this.userGoogle.additionalUserInfo.profile.email,
      fullName: this.userGoogle.additionalUserInfo.profile.name,
      image: this.userGoogle.additionalUserInfo.profile.picture,
      authorized : this.validarDominio(this.userGoogle.additionalUserInfo.profile.hd),
      birthDate: this.fechaFormato( this.registroForm.value.fechaNacimiento ),
      idDepartment: this.registroForm.value.departamento,
      idPlant: this.registroForm.value.planta,
      idRole:'user',
      fechaRegistro: new Date().toLocaleDateString(),
      departamentosCategorias: [ this.registroForm.value.departamento ],
      plantasCategorias: [this.registroForm.value.planta],
      regional : this.registroForm.value.regional
    };


    this.firestore.collection('users').add( usuario ).then( resp =>{

      this.matDialog.closeAll();
      this.mostrarSnack('Se registro correctamente','snackVerde');
      this.router.navigateByUrl('login')

     

    })
    .catch( err =>{
      this.matDialog.closeAll();
      this.mostrarSnack('Ocurrio un error en el proceso','snackRojo');
      console.log('Error al crearl el usuairo',err);
    });

    //console.log('Asi se va a crear el usuario', usuario);

  }

  private validarDominio( dominio:string ) :boolean{

    return dominio == 'sanmina.com' || dominio == '42-q.com';

  }

  public mostrarSnack(mensaje:string, color:string ){

    this.matSnack.open( mensaje , null , {
      duration: 3000,
      panelClass: color
    });

  }

  public mostrarCargando(mensaje:string, id:string){
    this.matDialog.open( CargandoComponent ,
      {
        hasBackdrop:true,
        disableClose:true,
        minWidth: 360,
        data: mensaje,
        id
      });
  }

  private fechaFormato( fechas: string):string{

    const fecha = new Date(fechas);

    let mes = '';

    if( fecha.getMonth()+1 <10 ){
      mes = '0'+(fecha.getMonth()+1);
    }else{
      mes = (fecha.getMonth()+1) + '';
    }

    return `${fecha.getFullYear()}-${mes}-${fecha.getDate()}`;

  }



  public async iniciarSesion(){

     await this.auth.signInGoogle();

  
  }

  private cargarZonas(){

    this.firebaseDB.database.ref('plant').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const planta :any= (categoria.toJSON() as any); 

      this.plantas.push( planta.name);
     

      })
      //console.log('Se cargaron ', this.plantas);
    });

    this.firebaseDB.database.ref('departament').get()
    .then( (valor)=>{

      valor.forEach( categoria =>{

      const departamento :any= (categoria.toJSON() as any);
      

      this.departamentos.push( departamento.name);
     

      })
      //console.log('Se cargaron ', this.departamentos);
    });


  }

  public terminosYCondiciones(){

    const a = document.createElement('a');
    a.href = 'https://docs.google.com/document/d/1iqkBUGZcJsv_M_HZV7-iJ_MlIehgw6QaPWScKwYocPw/edit?usp=sharing';
    a.target = '_blank';
    a.click()
    a.remove();

    
  }

  public numeroEmpleadoError() : boolean{

  return this.registroForm.controls.employeeNumber.dirty && (this.registroForm.controls.employeeNumber.invalid && this.registroForm.controls.employeeNumber.errors.existe)

  }

  private mostrarAlerta(mensaje:string, img:string ){

    this.matDialog.open( AlertaComponent,{
    hasBackdrop:true,
    disableClose:true,
    data:{
      mensaje
    },
    minWidth: 360
    });

  }

  private cargarFormulario(){

    this.registroForm = new FormGroup({
      employeeNumber: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$') ], this.numeroUnico.bind(this)),
      departamento: new FormControl(null, Validators.required),
      planta: new FormControl(null, Validators.required),
      fechaNacimiento: new FormControl( null, Validators.required),
      terminos: new FormControl( false, Validators.requiredTrue),
      regional: new FormControl(false)
    });

  }

}
