import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/controller/auth.controller';
import { GoogleStrategy } from './modules/auth/strategies/google.strategy';
import { UsersController } from './modules/users/controllers/users.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
