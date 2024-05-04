import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { config } from 'dotenv';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
  const { name, emails, photos } = profile;
  const email = emails[0].value;

  // Check if the email address ends with "@unmsm.edu.pe"
  if (!email.endsWith('@unmsm.edu.pe')) {
    // Return an error indicating unauthorized access
    // return done({ status: 401, message: 'Unauthorized access. Only users with @unmsm.edu.pe email addresses are allowed.' }, false);
    throw new UnauthorizedException('Unauthorized access. Only users with @unmsm.edu.pe email addresses are allowed.');
  }

  const user = {
    firstName: name.givenName,
    lastName: name.familyName,
    email,
    avatar: photos[0].value,
    accessToken,
  };
  done(null, user);
}

}