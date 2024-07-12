import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ versionKey: false })
export class Otp {
  @Prop({ required: true })
  @ApiProperty({ example: 'example@unmsm.edu.pe', description: 'The email address of the user' })
  email: string;

  @Prop({ required: true })
  @ApiProperty({ example: 123456, description: 'The OTP code' })
  otp: number;

  @Prop({ default: Date.now, expires: '5m' })
  @ApiProperty({ example: '2024-09-13T00:00:00.000Z', description: 'The creation date of the OTP' })
  createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);