import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({required: true})
    email: string;

    @Prop()
    studentCode: string;

    @Prop()
    faculty: string;

    @Prop()
    major: string;

    @Prop()
    userPhoto: string;

    @Prop()
    password: string;

    @Prop()
    googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);