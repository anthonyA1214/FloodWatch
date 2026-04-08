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

    if (!q || q.trim() === '') {
      return {
        reports: [],
        safety: [],
      };
    }
    const pattern = `%${q?.trim()}%`;

    const hasSeverities = severities && severities.length > 0;
    const hasTypes = types && types.length > 0;

    const [reportResults, safetyResults] = await Promise.all([
      hasSeverities
        ? this.db
            .select({
              id: reports.id,
              latitude: reports.latitude,
              longitude: reports.longitude,
              location: reports.location,
              severity: reports.severity,
            })
            .from(reports)
            .where(
              and(
                ilike(reports.location, pattern),
                inArray(reports.severity, severities),
              ),
            )
            .limit(3)
        : Promise.resolve([]),

      hasTypes
        ? this.db
            .select({
              id: safety.id,
              latitude: safety.latitude,
              longitude: safety.longitude,
              location: safety.location,
              type: safety.type,
            })
            .from(safety)
            .where(
              and(ilike(safety.location, pattern), inArray(safety.type, types)),
            )
            .limit(3)
        : Promise.resolve([]),
    ]);

    return {
      reports: reportResults,
      safety: safetyResults,
    };
  }
}
