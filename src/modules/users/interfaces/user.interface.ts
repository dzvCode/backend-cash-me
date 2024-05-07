import { Document } from "mongoose";

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
    googleId: string;
}