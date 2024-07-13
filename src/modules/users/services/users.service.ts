import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserCodeScrape } from 'src/common/scrape/user-code.scrape';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../interfaces/user.interface';

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
    user.firstName = UserCodeScrape.normalizeName(user.firstName);
    user.lastName = UserCodeScrape.normalizeName(user.lastName);

    const newUser = new this.userModel({
      ...user,
      role: UserRole.USER,
    });
    return await newUser.save();
  }

  /**
   * Finds a user by ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findById(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id).select('-role -refreshToken');
  }

  /**
   *  Finds a user by student code.
   * @param studentCode  - The student code of the user to find.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findByStudenCode(studentCode: string): Promise<User | undefined> {
    return await this.userModel.findOne({ studentCode }).select('-role -refreshToken');
  }

  /**
   * Finds a user by ID with full data.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the found user, or undefined if not found
   */
  async findByIdFull(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id);
  }

  /**
   * Finds a user by email and password.
   * @param loginDto - The login data.
   * @returns A promise that resolves to the found user, or undefined if not found.
   */
  async findByEmailAndPassword(loginDto: LoginDto): Promise<User | undefined> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
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
   * Updates a user partially by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The updated user data.
   * @returns A promise that resolves to the updated user.
   */
  async partialUpdate(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
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

  /**
   * Changes the role of a user by ID.
   * @param id The ID of the user to change the role.
   * @param role The new role.
   * @returns A promise that resolves to the updated user.
   */
  async changeRole(id: string, role: UserRole): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    return user.save();
  }

  /**
   * Gets all users.
   * @returns A promise that resolves to an array of users.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  destructuringUserNames(fullName: string) {
    //In case the user has 4 names
    const names = fullName.split(' ');
    let firstName = names[0] + ' ' + names[1];
    let lastName = names[names.length - 1] + ' ' + names[names.length - 2];

    if (names.length === 3) {
      firstName = names[0];
      lastName = names[2] + ' ' + names[1];
    }

    if (names.length === 2) {
      firstName = names[0];
      lastName = names[1];
    }

    if (names.length === 1) {
      firstName = names[0];
      lastName = '';
    }

    return { firstName, lastName };
  }

}
