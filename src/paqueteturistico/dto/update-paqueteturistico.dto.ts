import { PartialType } from '@nestjs/swagger';
import { CreatePaqueteTuristicoDto } from './create-paqueteturistico.dto';

export class UpdatePaqueteTuristicoDto extends PartialType(CreatePaqueteTuristicoDto) {}
