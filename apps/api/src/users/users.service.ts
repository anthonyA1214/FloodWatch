import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle-connection';
import { type DrizzleDB } from '../drizzle/types/drizzle';
import { users } from 'src/drizzle/schemas/users.schema';
import { and, count, desc, eq, like, or, sql } from 'drizzle-orm';
import { authAccounts } from 'src/drizzle/schemas/auth-accounts.schema';
import * as bcrypt from 'bcrypt';
import { type UploadedImageFile } from 'src/common/types/uploaded-image-file.type';
import { profileInfo } from 'src/drizzle/schemas';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImagesService } from 'src/images/images.service';
import { MailerService } from '../mailer/mailer.service';
import {
  CreateAdminInput,
  UpdateProfileInput,
  UserQueryInput,
} from '@repo/schemas';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private cloudinaryService: CloudinaryService,
    private imagesService: ImagesService,
    private mailerService: MailerService,
  ) {}

  async createUser(email: string, role: 'user' | 'admin' = 'user') {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const [user] = await this.db
      .insert(users)
      .values({ email, role })
      .returning();

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user;
  }

  async findById(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByIdWithProfile(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accounts = await this.db
      .select()
      .from(authAccounts)
      .where(eq(authAccounts.userId, id));

    const providers = accounts.map((acc) => acc.provider);
    const hasPassword = accounts.some(
      (acc) => acc.provider === 'local' && acc.hashedPassword,
    );

    return {
      id: user.users.id,
      email: user.users.email,
      role: user.users.role,
      status: user.users.status,
      firstName: user.profile_info?.firstName,
      lastName: user.profile_info?.lastName,
      name: `${user.profile_info?.firstName || ''} ${
        user.profile_info?.lastName || ''
      }`.trim(),
      providers,
      hasPassword,
      hasGoogleAuth: providers.includes('google'),
      profilePicture: user.profile_info?.profilePicture,
      homeAddress: user.profile_info?.homeAddress,
      createdAt: user.users.createdAt,
    };
  }

  async updateUserStatus(id: number, status: 'active' | 'blocked') {
    const [user] = await this.db
      .update(users)
      .set({ status, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createAuthAccount(
    userId: number,
    provider: 'local' | 'google',
    providerId: string,
    hashedPassword?: string,
  ) {
    const [authAccount] = await this.db
      .insert(authAccounts)
      .values({
        userId,
        provider,
        providerId,
        hashedPassword,
      })
      .returning();

    return authAccount;
  }

  async findAuthAccount(id: number, provider: 'local' | 'google') {
    const [authAccount] = await this.db
      .select()
      .from(authAccounts)
      .where(
        and(eq(authAccounts.userId, id), eq(authAccounts.provider, provider)),
      )
      .limit(1);

    return authAccount;
  }

  async findAuthAccountByProviderId(
    provider: 'local' | 'google',
    providerId: string,
  ) {
    const [authAccount] = await this.db
      .select()
      .from(authAccounts)
      .where(
        and(
          eq(authAccounts.provider, provider),
          eq(authAccounts.providerId, providerId),
        ),
      )
      .limit(1);

    return authAccount || null;
  }

  async validatePassword(userId: number, password: string) {
    const authAccount = await this.findAuthAccount(userId, 'local');

    if (!authAccount || !authAccount.hashedPassword) {
      return false;
    }

    return await bcrypt.compare(password, authAccount.hashedPassword);
  }

  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const [updatedAccount] = await this.db
      .update(authAccounts)
      .set({ hashedPassword, updatedAt: new Date() })
      .where(
        and(
          eq(authAccounts.userId, userId),
          eq(authAccounts.provider, 'local'),
        ),
      )
      .returning();

    return updatedAccount;
  }

  async createUserProfile(
    userId: number,
    firstName: string,
    lastName: string,
    homeAddress: string,
  ) {
    const [user] = await this.db
      .insert(profileInfo)
      .values({
        userId,
        firstName,
        lastName,
        homeAddress,
      })
      .returning();

    return user;
  }

  async findProfileByUserId(id: number) {
    const [profile] = await this.db
      .select()
      .from(profileInfo)
      .where(eq(profileInfo.userId, id))
      .limit(1);

    return profile;
  }

  async updateProfile(userId: number, updates: UpdateProfileInput) {
    const { firstName, lastName, homeAddress } = updates;

    const updateData: Partial<typeof profileInfo.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (homeAddress !== undefined) updateData.homeAddress = homeAddress;

    const [updatedProfile] = await this.db
      .update(profileInfo)
      .set(updateData)
      .where(eq(profileInfo.userId, userId))
      .returning();

    if (!updatedProfile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    return updatedProfile;
  }

  async uploadAvatar(id: number, image: UploadedImageFile) {
    try {
      const [profile] = await this.db
        .select()
        .from(profileInfo)
        .where(eq(profileInfo.userId, id))
        .limit(1);

      if (!profile) {
        throw new NotFoundException('User profile not found');
      }

      if (profile.profilePicturePublicId) {
        await this.cloudinaryService.deleteImage(
          profile.profilePicturePublicId,
        );
      }

      await this.imagesService.detectMimeType(image.buffer);
      const { buffer, mimetype } =
        await this.imagesService.normalizeAvatarImage(image.buffer);

      const normalizedFile: UploadedImageFile = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const result = await this.cloudinaryService.uploadImage(
        normalizedFile,
        'avatars',
      );

      await this.db
        .update(profileInfo)
        .set({
          profilePicture: result.secure_url as string,
          profilePicturePublicId: result.public_id as string,
          updatedAt: new Date(),
        })
        .where(eq(profileInfo.userId, id));

      return {
        message: 'Avatar uploaded successfully',
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new BadRequestException('Failed to upload avatar');
    }
  }

  async deleteAvatar(id: number) {
    try {
      const [profile] = await this.db
        .select()
        .from(profileInfo)
        .where(eq(profileInfo.userId, id))
        .limit(1);

      if (!profile) {
        throw new NotFoundException('User profile not found');
      }

      if (profile.profilePicturePublicId) {
        await this.cloudinaryService.deleteImage(
          profile.profilePicturePublicId,
        );
      }

      await this.db
        .update(profileInfo)
        .set({
          profilePicture: null,
          profilePicturePublicId: null,
          updatedAt: new Date(),
        })
        .where(eq(profileInfo.userId, id));

      return { message: 'Avatar deleted successfully' };
    } catch (error) {
      console.error('Error deleting avatar:', error);
      throw new BadRequestException('Failed to delete avatar');
    }
  }

  async findAll(userQueryDto: UserQueryInput) {
    const { page, limit, status, q } = userQueryDto;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const searchCondition = q
      ? or(
          like(users.email, `%${q}%`),
          like(profileInfo.firstName, `%${q}%`),
          like(profileInfo.lastName, `%${q}%`),
          sql`CONCAT(${profileInfo.firstName}, ' ', ${profileInfo.lastName}) ILIKE ${`%${q}%`}`,
        )
      : undefined;

    const whereClause =
      status && searchCondition
        ? and(eq(users.status, status), searchCondition)
        : status
          ? eq(users.status, status)
          : searchCondition;

    const [data, counts, statsResult] = await Promise.all([
      // Main paginated query
      this.db
        .select()
        .from(users)
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limitNumber)
        .offset(offset),

      // ✅ Paginated total: respects BOTH status filter + search
      this.db
        .select({ total: count() })
        .from(users)
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause),

      // ✅ Stats: only respects search, not status (so counts are always accurate)
      this.db
        .select({
          totalCount: count(),
          activeCount: sql<number>`COUNT(*) FILTER (WHERE ${users.status} = 'active')`,
          blockedCount: sql<number>`COUNT(*) FILTER (WHERE ${users.status} = 'blocked')`,
        })
        .from(users)
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(searchCondition),
    ]);

    const { total } = counts[0];
    const { totalCount, activeCount, blockedCount } = statsResult[0];

    const formattedData = data.map((item) => ({
      id: item.users.id,
      name: item.profile_info
        ? `${item.profile_info.firstName} ${item.profile_info.lastName}`.trim()
        : '',
      email: item.users.email,
      profilePicture: item.profile_info?.profilePicture || '',
      role: item.users.role,
      joinDate: item.users.createdAt,
      status: item.users.status,
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
        activeCount,
        blockedCount,
        totalCount,
      },
    };
  }

  async createAdmin(createAdminDto: CreateAdminInput) {
    const { email, password, first_name, last_name, home_address } =
      createAdminDto;

    const user = await this.findByEmail(email);
    if (user) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await this.createUser(email, 'admin');
    await this.createAuthAccount(newAdmin.id, 'local', email, hashedPassword);
    await this.createUserProfile(
      newAdmin.id,
      first_name,
      last_name,
      home_address,
    );

    return { message: 'Admin created successfully' };
  }

  async blockUser(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.updateUserStatus(id, 'blocked');

    // Send account blocked email if user has an email
    if (user.email) {
      try {
        await this.mailerService.sendAccountBlockedEmail(user.email);
      } catch (e) {
        // Log error but do not block operation

        console.error('Failed to send account blocked email:', e);
      }
    }

    return { message: 'User blocked successfully' };
  }

  async unblockUser(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.updateUserStatus(id, 'active');
    return { message: 'User unblocked successfully' };
  }
}
