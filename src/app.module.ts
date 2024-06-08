import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleStrategy } from './modules/auth/strategies/google.strategy';
import { ChatModule } from './modules/chat/chat.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    ChatModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
