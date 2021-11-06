import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'slidesUrl'
})
export class SlidesUrlPipe implements PipeTransform {


  constructor(
    private domSanizates: DomSanitizer
    ){}

  transform(url:string, ...args: unknown[]): unknown {
    return this.domSanizates.bypassSecurityTrustResourceUrl(url) ;
  }

}
