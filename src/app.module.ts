import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
<<<<<<< Updated upstream
import { OtpService } from './app.otp';
import { AppService } from './app.service';
=======
import { AppService } from './app.service';
// import { OtpService } from './app.otp';
>>>>>>> Stashed changes
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { StudentsModule } from './modules/students/students.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
<<<<<<< Updated upstream
import { UsersModule } from './modules/users/users.module';
=======
import { RoomsModule } from './modules/rooms/rooms.module';
// import { OtpService } from './modules/auh/otp/otp.service';
>>>>>>> Stashed changes

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    ChatModule,
    RoomsModule,
    StudentsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
<<<<<<< Updated upstream
  providers: [AppService, OtpService],
=======
  providers: [AppService, GoogleStrategy],
>>>>>>> Stashed changes
})
export class AppModule {}
