import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservaDocument = Reserva & Document;

@Schema({ timestamps: true })
export class Reserva {
  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  cliente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PaqueteTuristico', required: true })
  paquete: Types.ObjectId;

  @Prop({ required: true })
  fechaInicio: Date;

  @Prop({ min: 1 })
  numeroPersonas: number;

  @Prop({ min: 0 })
  total: number;

  @Prop({ enum: ['pendiente', 'confirmada', 'cancelada', 'completada'], default: 'pendiente' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);

ReservaSchema.index({ cliente: 1 });
ReservaSchema.index({ paquete: 1 });
ReservaSchema.index({ estado: 1 });
ReservaSchema.index({ fechaInicio: -1 });
