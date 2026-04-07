import { Inject, Injectable } from '@nestjs/common';
import { SearchQueryInput } from '@repo/schemas';
import { and, inArray } from 'drizzle-orm';
import { reports, safety } from './drizzle/schemas';
import { DRIZZLE } from './drizzle/drizzle-connection';
import { type DrizzleDB } from './drizzle/types/drizzle';
import { ilike } from 'drizzle-orm';

@Injectable()
export class AppService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async search(searchQuery: SearchQueryInput) {
    const { severities, types, q } = searchQuery;

    const pattern = `%${q}%`;

    const severityCondition =
      severities && severities.length > 0
        ? inArray(reports.severity, severities)
        : undefined;

    const typeCondition =
      types && types.length > 0 ? inArray(safety.type, types) : undefined;

    const [reportResults, safetyResults] = await Promise.all([
      this.db
        .select({
          id: reports.id,
          latitude: reports.latitude,
          longitude: reports.longitude,
          location: reports.location,
          severity: reports.severity,
        })
        .from(reports)
        .where(and(ilike(reports.location, pattern), severityCondition))
        .limit(3),

      this.db
        .select({
          id: safety.id,
          latitude: safety.latitude,
          longitude: safety.longitude,
          location: safety.location,
          type: safety.type,
        })
        .from(safety)
        .where(and(ilike(safety.location, pattern), typeCondition))
        .limit(3),
    ]);

    return {
      reports: reportResults,
      safety: safetyResults,
    };
  }
}
