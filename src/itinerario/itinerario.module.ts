import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItinerarioService } from './itinerario.service';
import { ItinerarioController } from './itinerario.controller';
import { UploadModule } from '../upload/upload.module';
import { Itinerario, ItinerarioSchema } from './schemas/itinerario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Itinerario.name, schema: ItinerarioSchema }]),
    UploadModule,
  ],
  controllers: [ItinerarioController],
  providers: [ItinerarioService],
  exports: [ItinerarioService],
})
export class ItinerarioModule {}
