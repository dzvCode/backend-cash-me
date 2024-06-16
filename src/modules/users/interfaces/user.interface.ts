import { Document } from "mongoose";
import { UserRole } from "src/common/enums/user-role.enum";

export interface User extends Document {    
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentCode: string;
    faculty: string;
    major: string;
    userPhoto: string;
    password: string;
    role: UserRole;
    googleId: string;
    refreshToken: string;
}