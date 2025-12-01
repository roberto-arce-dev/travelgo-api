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
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ItinerarioService } from './itinerario.service';
import { CreateItinerarioDto } from './dto/create-itinerario.dto';
import { UpdateItinerarioDto } from './dto/update-itinerario.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Itinerario')
@ApiBearerAuth('JWT-auth')
@Controller('itinerario')
export class ItinerarioController {
  constructor(
    private readonly itinerarioService: ItinerarioService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Itinerario' })
  @ApiBody({ type: CreateItinerarioDto })
  @ApiResponse({ status: 201, description: 'Itinerario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createItinerarioDto: CreateItinerarioDto) {
    const data = await this.itinerarioService.create(createItinerarioDto);
    return {
      success: true,
      message: 'Itinerario creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Itinerario' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Itinerario' })
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
  @ApiResponse({ status: 404, description: 'Itinerario no encontrado' })
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
    const updated = await this.itinerarioService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { itinerario: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Itinerarios' })
  @ApiResponse({ status: 200, description: 'Lista de Itinerarios' })
  async findAll() {
    const data = await this.itinerarioService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get('paquete/:paqueteId')
  @ApiOperation({ summary: 'Obtener Itinerarios por Paquete Turístico' })
  @ApiParam({ name: 'paqueteId', description: 'ID del Paquete Turístico' })
  @ApiResponse({ status: 200, description: 'Lista de itinerarios del paquete ordenados por día' })
  async findByPaquete(@Param('paqueteId') paqueteId: string) {
    const data = await this.itinerarioService.findByPaquete(paqueteId);
    return {
      success: true,
      data,
      total: data.length,
      message: data.length === 0 ? 'No se encontraron itinerarios para este paquete' : undefined
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Itinerario por ID' })
  @ApiParam({ name: 'id', description: 'ID del Itinerario' })
  @ApiResponse({ status: 200, description: 'Itinerario encontrado' })
  @ApiResponse({ status: 404, description: 'Itinerario no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.itinerarioService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Itinerario' })
  @ApiParam({ name: 'id', description: 'ID del Itinerario' })
  @ApiBody({ type: UpdateItinerarioDto })
  @ApiResponse({ status: 200, description: 'Itinerario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Itinerario no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateItinerarioDto: UpdateItinerarioDto
  ) {
    const data = await this.itinerarioService.update(id, updateItinerarioDto);
    return {
      success: true,
      message: 'Itinerario actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Itinerario' })
  @ApiParam({ name: 'id', description: 'ID del Itinerario' })
  @ApiResponse({ status: 200, description: 'Itinerario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Itinerario no encontrado' })
  async remove(@Param('id') id: string) {
    const itinerario = await this.itinerarioService.findOne(id);
    if (itinerario.imagen) {
      const filename = itinerario.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.itinerarioService.remove(id);
    return { success: true, message: 'Itinerario eliminado exitosamente' };
  }
}
