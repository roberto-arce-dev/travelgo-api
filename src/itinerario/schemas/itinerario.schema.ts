import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItinerarioDocument = Itinerario & Document;

@Schema({ timestamps: true })
export class Itinerario {
  @Prop({ type: Types.ObjectId, ref: 'PaqueteTuristico', required: true })
  paquete: Types.ObjectId;

  @Prop({ min: 1 })
  dia: number;

  @Prop({ type: [String], default: [] })
  actividades?: any;

  @Prop()
  descripcion?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ItinerarioSchema = SchemaFactory.createForClass(Itinerario);

ItinerarioSchema.index({ paquete: 1, dia: 1 });
