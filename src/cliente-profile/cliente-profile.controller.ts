import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClienteProfileService } from './cliente-profile.service';
import { CreateClienteProfileDto } from './dto/create-cliente-profile.dto';
import { UpdateClienteProfileDto } from './dto/update-cliente-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cliente-profile')
@ApiBearerAuth('JWT-auth')
@Controller('cliente-profile')
export class ClienteProfileController {
  constructor(private readonly clienteprofileService: ClienteProfileService) {}

  @Get('me')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.clienteprofileService.findOrCreateByUserId(userId);
  }

  @Put('me')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateClienteProfileDto) {
    return this.clienteprofileService.update(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.clienteprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.clienteprofileService.findByUserId(userId);
  }
}
