import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaqueteTuristicoService } from './paqueteturistico.service';
import { PaqueteTuristicoController } from './paqueteturistico.controller';
import { UploadModule } from '../upload/upload.module';
import { PaqueteTuristico, PaqueteTuristicoSchema } from './schemas/paqueteturistico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PaqueteTuristico.name, schema: PaqueteTuristicoSchema }]),
    UploadModule,
  ],
  controllers: [PaqueteTuristicoController],
  providers: [PaqueteTuristicoService],
  exports: [PaqueteTuristicoService],
})
export class PaqueteTuristicoModule {}
