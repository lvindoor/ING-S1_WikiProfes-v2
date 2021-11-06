import { Injectable } from '@angular/core';
import { AdminModule } from '../modulos/admin/admin.module';

import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8'

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() {

   }


   exportarAExcel( json: any[], excelFileName:string ):void{

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet( json );

    const workbook: XLSX.WorkBook = {
      Sheets:{ data : worksheet },
      SheetNames: ['data']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([ excelBuffer], { type: EXCEL_TYPE });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    link.download = excelFileName.split(' ').join('_');
    link.click();
    link.remove();


   }



}
