import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PaqueteTuristicoService } from './paqueteturistico.service';
import { CreatePaqueteTuristicoDto } from './dto/create-paqueteturistico.dto';
import { UpdatePaqueteTuristicoDto } from './dto/update-paqueteturistico.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('PaqueteTuristico')
@ApiBearerAuth('JWT-auth')
@Controller('paquete-turistico')
export class PaqueteTuristicoController {
  constructor(
    private readonly paqueteturisticoService: PaqueteTuristicoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo PaqueteTuristico' })
  @ApiBody({ type: CreatePaqueteTuristicoDto })
  @ApiResponse({ status: 201, description: 'PaqueteTuristico creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPaqueteTuristicoDto: CreatePaqueteTuristicoDto) {
    const data = await this.paqueteturisticoService.create(createPaqueteTuristicoDto);
    return {
      success: true,
      message: 'PaqueteTuristico creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Paqueteturistico' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Paqueteturistico' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Paqueteturistico no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.paqueteturisticoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { paqueteturistico: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Paqueteturisticos' })
  @ApiResponse({ status: 200, description: 'Lista de Paqueteturisticos' })
  async findAll() {
    const data = await this.paqueteturisticoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Listar paquetes turísticos disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes disponibles' })
  async findDisponibles() {
    const data = await this.paqueteturisticoService.findDisponibles();
    return { success: true, data, total: data.length };
  }

  @Get('destino/:destino')
  @ApiOperation({ summary: 'Filtrar paquetes por destino' })
  @ApiParam({ name: 'destino', description: 'Nombre del destino' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes por destino' })
  async findByDestino(@Param('destino') destino: string) {
    const data = await this.paqueteturisticoService.findByDestino(destino);
    return { success: true, data, total: data.length };
  }

  @Get('precio-rango')
  @ApiOperation({ summary: 'Filtrar paquetes por rango de precio' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes por rango de precio' })
  async findByPrecioRango(
    @Query('min') precioMin?: number,
    @Query('max') precioMax?: number
  ) {
    const data = await this.paqueteturisticoService.findByPrecioRango(precioMin, precioMax);
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener PaqueteTuristico por ID' })
  @ApiParam({ name: 'id', description: 'ID del PaqueteTuristico' })
  @ApiResponse({ status: 200, description: 'PaqueteTuristico encontrado' })
  @ApiResponse({ status: 404, description: 'PaqueteTuristico no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.paqueteturisticoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar PaqueteTuristico' })
  @ApiParam({ name: 'id', description: 'ID del PaqueteTuristico' })
  @ApiBody({ type: UpdatePaqueteTuristicoDto })
  @ApiResponse({ status: 200, description: 'PaqueteTuristico actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'PaqueteTuristico no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePaqueteTuristicoDto: UpdatePaqueteTuristicoDto
  ) {
    const data = await this.paqueteturisticoService.update(id, updatePaqueteTuristicoDto);
    return {
      success: true,
      message: 'PaqueteTuristico actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar PaqueteTuristico' })
  @ApiParam({ name: 'id', description: 'ID del PaqueteTuristico' })
  @ApiResponse({ status: 200, description: 'PaqueteTuristico eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'PaqueteTuristico no encontrado' })
  async remove(@Param('id') id: string) {
    const paqueteturistico = await this.paqueteturisticoService.findOne(id);
    if (paqueteturistico.imagen) {
      const filename = paqueteturistico.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.paqueteturisticoService.remove(id);
    return { success: true, message: 'PaqueteTuristico eliminado exitosamente' };
  }
}
