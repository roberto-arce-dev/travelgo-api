import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaqueteTuristicoDto } from './dto/create-paqueteturistico.dto';
import { UpdatePaqueteTuristicoDto } from './dto/update-paqueteturistico.dto';
import { PaqueteTuristico, PaqueteTuristicoDocument } from './schemas/paqueteturistico.schema';

@Injectable()
export class PaqueteTuristicoService {
  constructor(
    @InjectModel(PaqueteTuristico.name) private paqueteturisticoModel: Model<PaqueteTuristicoDocument>,
  ) {}

  async create(createPaqueteTuristicoDto: CreatePaqueteTuristicoDto): Promise<PaqueteTuristico> {
    const nuevoPaqueteTuristico = await this.paqueteturisticoModel.create(createPaqueteTuristicoDto);
    return nuevoPaqueteTuristico;
  }

  async findAll(): Promise<PaqueteTuristico[]> {
    const paqueteturisticos = await this.paqueteturisticoModel.find();
    return paqueteturisticos;
  }

  async findOne(id: string | number): Promise<PaqueteTuristico> {
    const paqueteturistico = await this.paqueteturisticoModel.findById(id);
    if (!paqueteturistico) {
      throw new NotFoundException(`PaqueteTuristico con ID ${id} no encontrado`);
    }
    return paqueteturistico;
  }

  async update(id: string | number, updatePaqueteTuristicoDto: UpdatePaqueteTuristicoDto): Promise<PaqueteTuristico> {
    const paqueteturistico = await this.paqueteturisticoModel.findByIdAndUpdate(id, updatePaqueteTuristicoDto, { new: true });
    if (!paqueteturistico) {
      throw new NotFoundException(`PaqueteTuristico con ID ${id} no encontrado`);
    }
    return paqueteturistico;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.paqueteturisticoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`PaqueteTuristico con ID ${id} no encontrado`);
    }
  }
}
