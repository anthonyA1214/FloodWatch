import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Controller('events/reports')
export class ReportsController {
  @Sse('stream')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((count) => ({ data: `Report ${count}` })));
  }
}
