import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva, ReservaDocument } from './schemas/reserva.schema';

@Injectable()
export class ReservaService {
  constructor(
    @InjectModel(Reserva.name) private reservaModel: Model<ReservaDocument>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const nuevoReserva = await this.reservaModel.create(createReservaDto);
    return nuevoReserva;
  }

  async findAll(): Promise<Reserva[]> {
    const reservas = await this.reservaModel.find().populate('cliente', 'nombre email telefono').populate('paquete', 'nombre descripcion precio');
    return reservas;
  }

  async findOne(id: string | number): Promise<Reserva> {
    const reserva = await this.reservaModel.findById(id).populate('cliente', 'nombre email telefono').populate('paquete', 'nombre descripcion precio');
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrado`);
    }
    return reserva;
  }

  async update(id: string | number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.reservaModel.findByIdAndUpdate(id, updateReservaDto, { new: true }).populate('cliente', 'nombre email telefono').populate('paquete', 'nombre descripcion precio')
    .populate('paquete', 'nombre destino duracionDias precio');
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrado`);
    }
    return reserva;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.reservaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrado`);
    }
  }
}
