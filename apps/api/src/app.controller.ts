import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { generateCsrfToken } from './csrf';
import { type Request, type Response } from 'express';
import { Roles } from './common/decorators/roles.decorator';
import { ReportsService } from './reports/reports.service';
import { SafetyService } from './safety/safety.service';

@Controller()
export class AppController {
  constructor(
    private reportsService: ReportsService,
    private safetyService: SafetyService,
  ) {}

  @Roles('admin')
  @Get('dashboard/stats')
  @HttpCode(HttpStatus.OK)
  async getDashboardStats() {
    const [activeAlerts, safetyLocations, totalReports, pendingReview] =
      await Promise.all([
        this.reportsService.countActiveAlerts(),
        this.safetyService.countSafetyLocations(),
        this.reportsService.countTotalReports(),
        this.reportsService.countPendingReview(),
      ]);

    return {
      activeAlerts,
      safetyLocations,
      totalReports,
      pendingReview,
    };
  }

  @Public()
  @Get('csrf-token')
  @HttpCode(HttpStatus.OK)
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = generateCsrfToken(req, res);
    return { csrfToken: token };
  }
}
