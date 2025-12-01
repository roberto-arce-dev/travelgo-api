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
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Pago')
@ApiBearerAuth('JWT-auth')
@Controller('pago')
export class PagoController {
  constructor(
    private readonly pagoService: PagoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Pago' })
  @ApiBody({ type: CreatePagoDto })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPagoDto: CreatePagoDto) {
    const data = await this.pagoService.create(createPagoDto);
    return {
      success: true,
      message: 'Pago creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Pago' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Pago' })
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
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
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
    const updated = await this.pagoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { pago: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Pagos' })
  @ApiResponse({ status: 200, description: 'Lista de Pagos' })
  async findAll() {
    const data = await this.pagoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Post('reserva/:reservaId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear pago para una reserva específica' })
  @ApiParam({ name: 'reservaId', description: 'ID de la Reserva' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['monto', 'metodoPago'],
      properties: {
        monto: { type: 'number', description: 'Monto del pago (debe coincidir con el total de la reserva)' },
        metodoPago: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia', 'webpay'], description: 'Método de pago' },
        estado: { type: 'string', enum: ['pendiente', 'aprobado', 'rechazado'], description: 'Estado del pago (opcional, por defecto: pendiente)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o ya existe un pago para esta reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async crearPagoParaReserva(
    @Param('reservaId') reservaId: string,
    @Body() pagoData: { monto: number; metodoPago: string; estado?: string }
  ) {
    const data = await this.pagoService.crearPagoParaReserva(reservaId, pagoData);
    return {
      success: true,
      message: 'Pago creado exitosamente para la reserva',
      data,
    };
  }

  @Get('reserva/:reservaId')
  @ApiOperation({ summary: 'Obtener pago de una reserva específica' })
  @ApiParam({ name: 'reservaId', description: 'ID de la Reserva' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró pago para esta reserva' })
  async findByReserva(@Param('reservaId') reservaId: string) {
    const data = await this.pagoService.findByReserva(reservaId);
    if (!data) {
      return {
        success: false,
        message: 'No se encontró un pago registrado para esta reserva',
        data: null,
      };
    }
    return {
      success: true,
      message: 'Pago encontrado',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Pago por ID' })
  @ApiParam({ name: 'id', description: 'ID del Pago' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.pagoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Pago' })
  @ApiParam({ name: 'id', description: 'ID del Pago' })
  @ApiBody({ type: UpdatePagoDto })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updatePagoDto: UpdatePagoDto
  ) {
    const data = await this.pagoService.update(id, updatePagoDto);
    return {
      success: true,
      message: 'Pago actualizado exitosamente',
      data,
    };
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del pago (pendiente/aprobado/rechazado)' })
  @ApiParam({ name: 'id', description: 'ID del Pago' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['estado'],
      properties: {
        estado: {
          type: 'string',
          enum: ['pendiente', 'aprobado', 'rechazado'],
          description: 'Nuevo estado del pago. Si se aprueba, la reserva se confirmará automáticamente.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Estado del pago actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async updateEstado(
    @Param('id') id: string,
    @Body() body: { estado: string }
  ) {
    const data = await this.pagoService.updateEstado(id, body.estado);
    return {
      success: true,
      message: `Estado del pago actualizado a: ${body.estado}`,
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Pago' })
  @ApiParam({ name: 'id', description: 'ID del Pago' })
  @ApiResponse({ status: 200, description: 'Pago eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async remove(@Param('id') id: string) {
    const pago = await this.pagoService.findOne(id);
    if (pago.imagen) {
      const filename = pago.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.pagoService.remove(id);
    return { success: true, message: 'Pago eliminado exitosamente' };
  }
}
