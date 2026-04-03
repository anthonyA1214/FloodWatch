import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

  @Public()
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllSafetyMapPins() {
    return await this.safetyService.getAllSafetyMapPins();
  }

  @Roles('admin')
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async getAllSafety(@Query() safetyLocationQuery: SafetyLocationQueryDto) {
    return await this.safetyService.getAllSafety(safetyLocationQuery);
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
}
