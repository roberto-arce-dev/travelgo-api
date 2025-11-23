import { PartialType } from '@nestjs/swagger';
import { CreateItinerarioDto } from './create-itinerario.dto';

export class UpdateItinerarioDto extends PartialType(CreateItinerarioDto) {}
