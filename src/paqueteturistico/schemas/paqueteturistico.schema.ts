import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaqueteTuristicoDocument = PaqueteTuristico & Document;

@Schema({ timestamps: true })
export class PaqueteTuristico {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  destino: string;

  @Prop({ min: 1 })
  duracionDias: number;

  @Prop({ min: 0 })
  precio: number;

  @Prop({ type: [String], default: [] })
  incluye?: any;

  @Prop({ type: [String], default: [] })
  excluye?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

  @Prop({ default: true })
  activo?: boolean;

}

export const PaqueteTuristicoSchema = SchemaFactory.createForClass(PaqueteTuristico);

PaqueteTuristicoSchema.index({ destino: 1 });
PaqueteTuristicoSchema.index({ activo: 1 });
PaqueteTuristicoSchema.index({ nombre: 'text', descripcion: 'text' });
