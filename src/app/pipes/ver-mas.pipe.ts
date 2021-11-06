import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verMas'
})
export class VerMasPipe implements PipeTransform {

  transform(value:string): string {
    if(value.length > 30){
        return value.substring(0, 30) + ' ...';
    }else{
        return value;
    }


}

}
