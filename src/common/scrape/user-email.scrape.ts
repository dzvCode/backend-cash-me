import * as cheerio from 'cheerio';

export class UserEmailScrape {
  static async scrapeAlumno(email: string) {
    const domain = 'https://sum.unmsm.edu.pe';
    const url = `${domain}/alumnoWebSum/login`;

    //First, we need to get the cookies
    const cookieResponse = await fetch(url);
    const cookieHeaders = cookieResponse.headers.getSetCookie();
    const filteredCookies = this.filterCookies(cookieHeaders);

    if (cookieResponse.status !== 200) {
      throw new Error(
        `Error ${cookieResponse.status}, origin: ${cookieResponse.url} failed to fetch`,
      );
    }

    //Then, we need to get the csrf token
    const $ = cheerio.load(await cookieResponse.text());
    const csrf = $('input[name="_csrf"]').val();

    //Then, we can make the request to login
    const options = {
      method: 'POST',
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-419,es;q=0.9',
        'Cache-Control': 'max-age=0',
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: filteredCookies,
        Origin: domain,
        Referer: url,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
      },
      body: `_csrf=${csrf}&login=${email}&clave=`,
    };
    const response = await fetch(url, options);

    if (response.status !== 200) {
      throw new Error(
        `Error ${response.status}, origin: ${response.url} failed to fetch`,
      );
    }

    return this.emailExistance(await response.text(), email);
  }

  private static emailExistance(html: string, email: string): any {
    const $ = cheerio.load(html);
    const transformedEmail = this.transformEmail(email);
    const errorMessage = `El usuario ${transformedEmail} no fue encontrado.`;

    const loginError = $('.login-error span').text();
    //If the error message is different from the default one, then the email exists
    return loginError !== errorMessage;
  }

  private static transformEmail(email: string): string {
    return email.split('@')[0];
  }

  private static filterCookies(setCookieHeaders: string[]): string {
    const cookies = setCookieHeaders
      .map((cookie) => cookie.split(';')[0])
      .filter(
        (cookie) =>
          cookie.startsWith('JSESSIONID=') ||
          cookie.startsWith('HWWAFSESID=') ||
          cookie.startsWith('HWWAFSESTIME=') ||
          cookie.startsWith('8390ce12805d422a96ff76763b01e900='),
      )
      .join('; ');

    return cookies;
  }
}
