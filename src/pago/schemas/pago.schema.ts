import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PagoDocument = Pago & Document;

@Schema({ timestamps: true })
export class Pago {
  @Prop({ type: Types.ObjectId, ref: 'Reserva', required: true,  unique: true  })
  reserva: Types.ObjectId;

  @Prop({ min: 0 })
  monto: number;

  @Prop({ enum: ['efectivo', 'tarjeta', 'transferencia', 'webpay'] })
  metodoPago: string;

  @Prop({ enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' })
  estado?: string;

  @Prop({ default: Date.now })
  fecha?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PagoSchema = SchemaFactory.createForClass(Pago);

PagoSchema.index({ reserva: 1 });
PagoSchema.index({ estado: 1 });
