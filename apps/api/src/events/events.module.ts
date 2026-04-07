import { Module } from '@nestjs/common';

import { ReportsController } from './reports/reports.controller';

@Module({
  controllers: [ReportsController],
})
export class EventsModule {}
