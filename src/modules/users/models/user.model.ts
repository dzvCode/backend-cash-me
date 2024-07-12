import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums/user-role.enum';

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
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

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop()
  googleId: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: true })
  disabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
