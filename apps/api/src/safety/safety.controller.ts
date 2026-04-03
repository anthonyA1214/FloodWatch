import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateSafetyLocationDto,
  SafetyLocationListQueryDto,
  SafetyLocationQueryDto,
  UpdateSafetyLocationDto,
} from '@repo/schemas';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthRequest } from 'src/auth/types/auth-request.type';
import { UserStatusGuard } from 'src/common/guards/user-status/user-status.guard';
import { SafetyService } from './safety.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('safety')
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Roles('admin')
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllSafety(@Query() safetyLocationQuery: SafetyLocationQueryDto) {
    return await this.safetyService.getAllSafety(safetyLocationQuery);
  }

  @Public()
  @Get('map-pins')
  @HttpCode(HttpStatus.OK)
  async getAllSafetyMapPins() {
    return await this.safetyService.getAllSafetyMapPins();
  }

  @Public()
  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getSafetyList(
    @Query() safetyLocationListQueryDto: SafetyLocationListQueryDto,
  ) {
    return await this.safetyService.getSafetyList(safetyLocationListQueryDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSafetyDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.safetyService.getSafetyDetail(id);
  }

  @Roles('admin')
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createSafetyLocation(
    @Request() req: AuthRequest,
    @Body() safetyLocationDto: CreateSafetyLocationDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.safetyService.createSafetyLocation(
      safetyLocationDto,
      image,
    );
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  async deleteSafetyLocation(@Param('id', ParseIntPipe) id: number) {
    return await this.safetyService.deleteSafetyLocation(id);
  }

  @Roles('admin')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserStatusGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateSafetyLocation(
    @Param('id', ParseIntPipe) id: number,
    @Body() safetyLocationDto: UpdateSafetyLocationDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.safetyService.updateSafetyLocation(
      id,
      safetyLocationDto,
      image,
    );
  }
}
