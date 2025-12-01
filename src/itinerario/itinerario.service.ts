import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';
import { Itinerario, ItinerarioDocument } from './schemas/itinerario.schema';

@Injectable()
export class ItinerarioService {
  constructor(
    @InjectModel(Itinerario.name) private itinerarioModel: Model<ItinerarioDocument>,
  ) {}

  async create(createItinerarioDto: CreateItinerarioDto): Promise<Itinerario> {
    const nuevoItinerario = await this.itinerarioModel.create(createItinerarioDto);
    return nuevoItinerario;
  }

  async findAll(): Promise<Itinerario[]> {
    const itinerarios = await this.itinerarioModel.find();
    return itinerarios;
  }

  async findByPaquete(paqueteId: string): Promise<Itinerario[]> {
    const itinerarios = await this.itinerarioModel
      .find({ paquete: paqueteId })
      .sort({ dia: 1 })
      .populate('paquete', 'nombre destino precio');
    return itinerarios;
  }

  async findOne(id: string | number): Promise<Itinerario> {
    const itinerario = await this.itinerarioModel.findById(id)
    .populate('paquete', 'nombre destino');
    if (!itinerario) {
      throw new NotFoundException(`Itinerario con ID ${id} no encontrado`);
    }
    return itinerario;
  }

  async update(id: string | number, updateItinerarioDto: UpdateItinerarioDto): Promise<Itinerario> {
    const itinerario = await this.itinerarioModel.findByIdAndUpdate(id, updateItinerarioDto, { new: true })
    .populate('paquete', 'nombre destino');
    if (!itinerario) {
      throw new NotFoundException(`Itinerario con ID ${id} no encontrado`);
    }
    return itinerario;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.itinerarioModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Itinerario con ID ${id} no encontrado`);
    }
  }
}
