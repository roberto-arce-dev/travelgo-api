import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago, PagoDocument } from './schemas/pago.schema';
import { Reserva, ReservaDocument } from '../reserva/schemas/reserva.schema';

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(Pago.name) private pagoModel: Model<PagoDocument>,
    @InjectModel(Reserva.name) private reservaModel: Model<ReservaDocument>,
  ) {}

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    const nuevoPago = await this.pagoModel.create(createPagoDto);
    return nuevoPago;
  }

  async findAll(): Promise<Pago[]> {
    const pagos = await this.pagoModel.find();
    return pagos;
  }

  async findOne(id: string | number): Promise<Pago> {
    const pago = await this.pagoModel.findById(id)
    .populate('reserva', 'total estado');
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return pago;
  }

  async update(id: string | number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const pago = await this.pagoModel.findByIdAndUpdate(id, updatePagoDto, { new: true })
    .populate('reserva', 'total estado');
    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return pago;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.pagoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
  }

  async findByReserva(reservaId: string): Promise<Pago | null> {
    const pago = await this.pagoModel
      .findOne({ reserva: new Types.ObjectId(reservaId) })
      .populate({
        path: 'reserva',
        populate: [
          { path: 'cliente', select: 'nombre email telefono' },
          { path: 'paquete', select: 'nombre destino precio' }
        ]
      });
    return pago;
  }

  async crearPagoParaReserva(reservaId: string, pagoData: {
    monto: number;
    metodoPago: string;
    estado?: string;
  }): Promise<Pago> {
    // Verificar que la reserva existe
    const reserva = await this.reservaModel.findById(reservaId);
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${reservaId} no encontrada`);
    }

    // Verificar que no existe ya un pago para esta reserva
    const pagoExistente = await this.pagoModel.findOne({ reserva: new Types.ObjectId(reservaId) });
    if (pagoExistente) {
      throw new BadRequestException(`Ya existe un pago registrado para esta reserva`);
    }

    // Validar que el monto coincide con el total de la reserva
    if (pagoData.monto !== reserva.total) {
      throw new BadRequestException(
        `El monto del pago (${pagoData.monto}) no coincide con el total de la reserva (${reserva.total})`
      );
    }

    // Crear el pago
    const nuevoPago = await this.pagoModel.create({
      reserva: new Types.ObjectId(reservaId),
      monto: pagoData.monto,
      metodoPago: pagoData.metodoPago,
      estado: pagoData.estado || 'pendiente',
      fecha: new Date(),
    });

    return await this.findOne((nuevoPago._id as Types.ObjectId).toString());
  }

  async updateEstado(pagoId: string, estado: string): Promise<Pago> {
    const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException(
        `Estado inválido. Los estados válidos son: ${estadosValidos.join(', ')}`
      );
    }

    const pago = await this.pagoModel
      .findByIdAndUpdate(
        pagoId,
        { estado },
        { new: true }
      )
      .populate({
        path: 'reserva',
        populate: [
          { path: 'cliente', select: 'nombre email telefono' },
          { path: 'paquete', select: 'nombre destino precio' }
        ]
      });

    if (!pago) {
      throw new NotFoundException(`Pago con ID ${pagoId} no encontrado`);
    }

    // Si el pago fue aprobado, actualizar el estado de la reserva a 'confirmada'
    if (estado === 'aprobado' && pago.reserva) {
      await this.reservaModel.findByIdAndUpdate(
        (pago.reserva as any)._id,
        { estado: 'confirmada' }
      );
    }

    return pago;
  }
}
