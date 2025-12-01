import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva, ReservaDocument } from './schemas/reserva.schema';
import { PaqueteTuristico, PaqueteTuristicoDocument } from '../paqueteturistico/schemas/paqueteturistico.schema';

@Injectable()
export class ReservaService {
  constructor(
    @InjectModel(Reserva.name) private reservaModel: Model<ReservaDocument>,
    @InjectModel(PaqueteTuristico.name) private paqueteTuristicoModel: Model<PaqueteTuristicoDocument>,
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
    // Obtener el paquete turístico para calcular el precio real
    const paquete = await this.paqueteTuristicoModel.findById(reservaDto.paqueteId);

    if (!paquete) {
      throw new NotFoundException(`Paquete Turístico con ID ${reservaDto.paqueteId} no encontrado`);
    }

    if (!paquete.disponible || !paquete.activo) {
      throw new NotFoundException(`El paquete turístico no está disponible para reservas`);
    }

    // Calcular precio total basado en el precio del paquete y número de personas
    const total = paquete.precio * reservaDto.numeroPersonas;

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
