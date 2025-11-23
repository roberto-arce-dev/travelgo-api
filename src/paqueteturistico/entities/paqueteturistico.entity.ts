export class PaqueteTuristico {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  imagenThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PaqueteTuristico>) {
    Object.assign(this, partial);
  }
}
