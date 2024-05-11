import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../interfaces/user.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
/**
 * Service class for managing users.
 */
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * Creates a new user.
   *
   * @param user - The user data to create.
   * @returns A Promise that resolves to the created user.
   */
  async create(user: CreateUserDto): Promise<User> {
    user.firstName = this.normalizeName(user.firstName);
    user.lastName = this.normalizeName(user.lastName);
    const extractedData = await this.scrapeAlumno(user.studentCode);

    const newUser = new this.userModel({
      ...user,
      faculty: extractedData?.faculty,
      major: extractedData?.major,
      userPhoto: extractedData?.userPhoto ?? user.userPhoto,
      role: user.role || UserRole.USER,
    });
    return await newUser.save();
  }

  /**
   * Finds a user by ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findById(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id);
  }

  /**
   * Finds a user by email and password.
   * @param loginDto - The login data.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findByEmailAndPassword(loginDto: LoginDto): Promise<User | undefined> {
    const { email, password } = loginDto;
    return await this.userModel.findOne({ email, password });
  }

  /**
   * Finds a user by Google ID.
   * @param googleId - The Google ID.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findByGoogleId(googleId: string): Promise<User | undefined> {
    return await this.userModel.findOne({ googleId });
  }

  /**
   * Finds a user by Google ID or email.
   * @param googleId - The Google ID.
   * @param email - The email.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findByGoogleIdOrEmail(
    googleId: string,
    email: string,
  ): Promise<User | undefined> {
    const findByGoogleId = await this.userModel.findOne({ googleId });
    const findByEmail = await this.userModel.findOne({ email });

    return findByGoogleId ?? findByEmail;
  }

  /**
   * Scrapes student data from a website using a given student code.
   * @param codigo - The sutdent code to scrape.
   * @returns A promise that resolves to the scraped student data.
   */
  async scrapeAlumno(codigo: string): Promise<any> {
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
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The updated user data.
   * @returns A promise that resolves to the updated user.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to the deleted user.
   */
  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async changeRole(id: string, role: UserRole): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    return user.save();
  }

  /**
   * Parses the form data from the HTML response.
   * @param html - The HTML response.
   * @param codigo - The code to include in the form data.
   * @returns The parsed form data.
   */
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
      ctl00$ContentPlaceHolder1$txtUsuario: codigo,
    };
  }

  /**
   * Parses the student data from the HTML response.
   * @param html - The HTML response.
   * @param baseUrl - The base URL of the website.
   * @returns The parsed student data.
   */
  private parseAlumno(html: string, baseUrl: string): any {
    const $ = cheerio.load(html);
    const emptyImage = 'imagenes-UNMSM/sinimg.jpg';
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
    const photo = $('img[id="ctl00_ContentPlaceHolder1_imgAlumno"]').attr(
      'src',
    );
    const userPhoto = photo === emptyImage ? '' : baseUrl + photo;

    if (!faculty || !major) {
      return null;
    }

    return { faculty, major, userPhoto };
  }

  /**
   * Normalizes a name by converting it to lowercase and capitalizing the first letter of each word.
   * @param name - The name to normalize.
   * @returns The normalized name.
   */
  private normalizeName(name: string): string {
    return name
      ? name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
      : '';
  }
}
