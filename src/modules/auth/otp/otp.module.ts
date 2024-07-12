import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpService } from 'src/app.otp'; 
import { UserSchema } from 'src/modules/users/models/user.model';
import { UsersService } from 'src/modules/users/services/users.service';
import { OtpController } from './controller/otp.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [OtpService, UsersService],
  exports: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
