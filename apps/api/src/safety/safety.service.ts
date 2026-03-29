import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSafetyLocationInput,
  SafetyLocationListQueryInput,
  SafetyLocationQueryDto,
} from '@repo/schemas';
import { ilike, inArray } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { and, count, eq, like, or, sql } from 'drizzle-orm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DRIZZLE } from 'src/drizzle/drizzle-connection';
import { safety } from 'src/drizzle/schemas';
import { type DrizzleDB } from 'src/drizzle/types/drizzle';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class SafetyService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAllSafetyMapPins() {
    return await this.db
      .select({
        id: safety.id,
        latitude: safety.latitude,
        longitude: safety.longitude,
        type: safety.type,
      })
      .from(safety);
  }

  async getSafetyDetail(safetyId: number) {
    const [result] = await this.db
      .select({
        id: safety.id,
        latitude: safety.latitude,
        longitude: safety.longitude,
        location: safety.location,
        address: safety.address,
        description: safety.description,
        image: safety.image,
        type: safety.type,
        availability: safety.availability,
        contactNumber: safety.contactNumber,
        createdAt: safety.createdAt,
      })
      .from(safety)
      .where(eq(safety.id, safetyId))
      .limit(1);

    return result;
  }

  async getSafetyList(
    safetyLocationListQueryDto: SafetyLocationListQueryInput,
  ) {
    const { page, limit, types, q } = safetyLocationListQueryDto;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const searchCondition = q
      ? or(ilike(safety.location, `%${q}%`), ilike(safety.address, `%${q}%`))
      : undefined;
    const typeCondition =
      types && types.length > 0 ? inArray(safety.type, types) : undefined;

    const whereClause =
      typeCondition && searchCondition
        ? and(typeCondition, searchCondition)
        : (typeCondition ?? searchCondition);

    const [data, counts] = await Promise.all([
      this.db
        .select({
          id: safety.id,
          location: safety.location,
          address: safety.address,
          type: safety.type,
          availability: safety.availability,
        })
        .from(safety)
        .where(whereClause)
        .orderBy(desc(safety.createdAt))
        .limit(limitNumber)
        .offset(offset),

      this.db.select({ total: count() }).from(safety).where(whereClause),
    ]);

    const { total } = counts[0];

    return {
      data,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
    };
  }

  async getAllSafety(safetyLocationQueryDto: SafetyLocationQueryDto) {
    const { page, limit, type, q } = safetyLocationQueryDto;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Build search condition once, reused across all queries
    const searchCondition = q
      ? or(like(safety.location, `%${q}%`), like(safety.address, `%${q}%`))
      : undefined;

    const whereClause =
      type && searchCondition
        ? and(eq(safety.type, type), searchCondition)
        : type
          ? eq(safety.type, type)
          : searchCondition;

    const [data, counts, statsResult] = await Promise.all([
      this.db
        .select()
        .from(safety)
        .where(whereClause)
        .limit(limitNumber)
        .offset(offset),

      this.db.select({ total: count() }).from(safety).where(whereClause),

      this.db
        .select({
          totalCount: count(),
          shelterCount: sql<number>`COUNT(*) FILTER (WHERE ${safety.type} = 'shelter')`,
          hospitalCount: sql<number>`COUNT(*) FILTER (WHERE ${safety.type} = 'hospital')`,
        })
        .from(safety)
        .where(searchCondition),
    ]);

    const { total } = counts[0];
    const { totalCount, shelterCount, hospitalCount } = statsResult[0];

    const formattedData = data.map((item) => ({
      id: item.id,
      location: item.location,
      address: item.address,
      description: item.description,
      latitude: item.latitude,
      longitude: item.longitude,
      type: item.type,
      image: item.image,
      createdAt: item.createdAt,
    }));

    return {
      data: formattedData,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
      stats: {
        shelterCount,
        hospitalCount,
        totalCount,
      },
    };
  }

  async createSafetyLocation(
    safetyLocationDto: CreateSafetyLocationInput,
    image: Express.Multer.File,
  ) {
    const {
      latitude,
      longitude,
      type,
      description,
      address,
      locationName,
      availability,
      contactNumber,
    } = safetyLocationDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const { buffer, mimetype } = await this.imagesService.normalizeImage(
        image.buffer,
      );

      const normalizedFile: Express.Multer.File = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const uploaded = await this.cloudinaryService.uploadImage(
        normalizedFile,
        'safety',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    await this.db.insert(safety).values({
      latitude,
      longitude,
      type,
      description,
      image: imageUrl,
      imagePublicId,
      location: locationName,
      address,
      availability,
      contactNumber,
    });
  }
}
