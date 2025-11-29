import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findByCliente(clienteId: string): Promise<Reserva[]> {
    const reservas = await this.reservaModel
      .find({ cliente: new Types.ObjectId(clienteId) })
      .populate('cliente', 'nombre email telefono')
      .populate('paquete', 'nombre destino duracionDias precio imagen')
      .sort({ fechaReserva: -1 });
    return reservas;
  }

  async crearReserva(reservaDto: {
    clienteId: string;
    paqueteId: string;
    fechaViaje: string;
    numeroPersonas: number;
    solicitudesEspeciales?: string;
  }): Promise<Reserva> {
    // Calcular precio total basado en número de personas
    // En un caso real, obtendrías el precio del paquete
    const precioBase = 500; // Precio base por persona
    const total = precioBase * reservaDto.numeroPersonas;

    const nuevaReserva = await this.reservaModel.create({
      cliente: new Types.ObjectId(reservaDto.clienteId),
      paquete: new Types.ObjectId(reservaDto.paqueteId),
      fechaInicio: new Date(reservaDto.fechaViaje),
      numeroPersonas: reservaDto.numeroPersonas,
      total: total,
      estado: 'pendiente'
    });

    return await this.findOne((nuevaReserva._id as Types.ObjectId).toString());
  }

  async getEstadoPago(reservaId: string): Promise<any> {
    const reserva = await this.reservaModel
      .findById(reservaId)
      .populate('paquete', 'nombre precio')
      .select('estado total fechaInicio numeroPersonas');
    
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
    }

    return {
      reservaId: reservaId,
      estado: reserva.estado || 'pendiente',
      estadoPago: reserva.estado === 'confirmada' ? 'pagado' : 'pendiente',
      total: reserva.total || 0,
      fechaInicio: reserva.fechaInicio,
      numeroPersonas: reserva.numeroPersonas || 1
    };
  }
}
