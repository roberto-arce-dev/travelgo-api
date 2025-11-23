import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { UploadModule } from '../upload/upload.module';
import { Pago, PagoSchema } from './schemas/pago.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pago.name, schema: PagoSchema }]),
    UploadModule,
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {}
