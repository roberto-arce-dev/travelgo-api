import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaqueteTuristicoDto {
  @ApiProperty({
    example: 'Nombre del PaqueteTuristico',
    description: 'Nombre del PaqueteTuristico',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Cusco, Perú',
    description: 'Destino principal del paquete turístico',
  })
  @IsNotEmpty()
  @IsString()
  destino: string;

  @ApiPropertyOptional({
    example: 'Descripción del PaqueteTuristico',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;

  @ApiPropertyOptional({
    example: 899.99,
    description: 'Precio del paquete turístico (opcional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Duración del paquete en días (opcional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duracionDias?: number;
}
