import { Module } from '@nestjs/common';
import { ScrappingService } from './scrapping.service';

@Module({
    providers: [ScrappingService],
    exports: [ScrappingService],
})
export class ScrappingModule {}
