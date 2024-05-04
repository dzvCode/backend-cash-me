import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrappingService {
    async scrapeAlumno(codigo: string): Promise<any>{
        const url = 'http://websecgen.unmsm.edu.pe/carne/'
        const aspx = 'carne.aspx'
        const response = await fetch(url + aspx)                
        const formData = this.parseFormData(await response.text(), codigo)
        const alumnoHtml = await fetch(url + aspx, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData).toString()
        })

        return this.parseAlumno(await alumnoHtml.text(), url)
    }

    private parseFormData(html: string, codigo: string): any {
        const $ = cheerio.load(html);
        const viewstate = $('input[name="__VIEWSTATE"]').val();
        const viewStateGenerator = $('input[name="__VIEWSTATEGENERATOR"]').val();
        const eventValidation = $('input[name="__EVENTVALIDATION"]').val();
    
        return {
          __VIEWSTATE: viewstate,
          __VIEWSTATEGENERATOR: viewStateGenerator,
          __EVENTVALIDATION: eventValidation,
          __EVENTTARGET: 'ctl00$ContentPlaceHolder1$cmdConsultar',
          'ctl00$ContentPlaceHolder1$txtUsuario': codigo,
        };
      }

      private parseAlumno(html: string, baseUrl: string): any {
        const $ = cheerio.load(html);
        return {
          name: $('input[name="ctl00$ContentPlaceHolder1$txtAlumno"]').val(),
          code: $('input[name="ctl00$ContentPlaceHolder1$txtUsuario"]').val(),
          faculty: $('input[name="ctl00$ContentPlaceHolder1$txtFacultad"]').val(),
          career: $('input[name="ctl00$ContentPlaceHolder1$txtPrograma"]').val(),
          photo: baseUrl + $('img[id="ctl00_ContentPlaceHolder1_imgAlumno"]').attr('src'),
        };
      }
}
