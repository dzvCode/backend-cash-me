import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './google.strategy';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScrappingService } from './scrapping/scrapping.service';
import { ScrappingModule } from './scrapping/scrapping.module';

@Module({
  imports: [AuthModule, UsersModule, ScrappingModule],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy, ScrappingService],
})
export class AppModule {}
