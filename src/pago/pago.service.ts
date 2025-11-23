import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago, PagoDocument } from './schemas/pago.schema';

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(Pago.name) private pagoModel: Model<PagoDocument>,
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
}
