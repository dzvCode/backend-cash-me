import * as cheerio from 'cheerio';

export class UserCodeScrape {
  /**
   * Scrapes student data from a website using a given student code.
   * @param codigo - The sutdent code to scrape.
   * @returns A promise that resolves to the scraped student data.
   */
  static async scrapeAlumno(codigo: string): Promise<any> {
    const url = 'http://websecgen.unmsm.edu.pe/carne/';
    const aspx = 'carne.aspx';
    const response = await fetch(url + aspx);
    const formData = this.parseFormData(await response.text(), codigo);
    const alumnoHtml = await fetch(url + aspx, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    });

    return this.parseAlumno(await alumnoHtml.text(), url);
  }

  /**
   * Parses the form data from the HTML response.
   * @param html - The HTML response.
   * @param codigo - The code to include in the form data.
   * @returns The parsed form data.
   */
  private static parseFormData(html: string, codigo: string): any {
    const $ = cheerio.load(html);
    const viewstate = $('input[name="__VIEWSTATE"]').val();
    const viewStateGenerator = $('input[name="__VIEWSTATEGENERATOR"]').val();
    const eventValidation = $('input[name="__EVENTVALIDATION"]').val();

    return {
      __VIEWSTATE: viewstate,
      __VIEWSTATEGENERATOR: viewStateGenerator,
      __EVENTVALIDATION: eventValidation,
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$cmdConsultar',
      ctl00$ContentPlaceHolder1$txtUsuario: codigo,
    };
  }

  /**
   * Parses the student data from the HTML response.
   * @param html - The HTML response.
   * @param baseUrl - The base URL of the website.
   * @returns The parsed student data.
   */
  private static parseAlumno(html: string, baseUrl: string): any {
    const $ = cheerio.load(html);    
    const faculty = this.normalizeName(
      $('input[name="ctl00$ContentPlaceHolder1$txtFacultad"]')
        .val()
        ?.toString(),
    );
    const major = this.normalizeName(
      $('input[name="ctl00$ContentPlaceHolder1$txtPrograma"]')
        .val()
        ?.toString(),
    );

    const name = this.normalizeName(
      $('input[name="ctl00$ContentPlaceHolder1$txtAlumno"]')
        .val()
        ?.toString(),
    );

    const photo = $('img[id="ctl00_ContentPlaceHolder1_imgAlumno"]').attr(
      'src',
    );
    
    const userPhoto = baseUrl + photo;

    if (!faculty || !major || !name) {
      return null;
    }

    return { faculty, major, name, userPhoto };
  }

  /**
   * Normalizes a name by converting it to lowercase and capitalizing the first letter of each word.
   * @param name - The name to normalize.
   * @returns The normalized name.
   */
  static normalizeName(name: string): string {
    const monosyllables = ['de', 'e', 'y', 'a', 'o', 'u']; 

    if(!name) return '';

    let capitalized = name.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());

    // Lowercase monosyllables
    capitalized = capitalized.split(' ').map(word => 
        monosyllables.includes(word.toLowerCase()) ? word.toLowerCase() : word
    ).join(' ');

    return capitalized;
  }

}