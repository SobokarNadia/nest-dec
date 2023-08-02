import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { PaginationDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import {
  UserCreateDto,
  UserLoginDto,
  UserLoginSocialDto,
} from './dto/user.dto';
import { PublicUserData } from './interface/user.interface';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private salt = 5;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginationDto<PublicUserData>> {
    query.sort = query.sort || 'id';
    query.order = query.order || 'ASC';
    const options = {
      page: query.page || 1,
      limit: query.limit || 3,
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.car', 'car')
      .select('id, age, email, name');

    if (query.search) {
      queryBuilder.where('name IN(:...search)', {
        search: query.search.split(','),
      });
    }

    if (query.model) {
      queryBuilder.andWhere(
        `LOWER(ani.class) LIKE '%${query.model.toLowerCase()}%'`,
      );
    }

    queryBuilder.orderBy(`"${query.sort}"`, (query.order as 'ASC') || 'DESC');

    const [pagination, rawResults] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: rawResults as [PublicUserData],
    };
  }

  async createUser(data: UserCreateDto): Promise<HttpStatus> {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    data.password = await this.getHash(data.password);
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);

    return HttpStatus.CREATED;
  }

  async getUserById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getHash(password) {
    return await bcrypt.hash(password, this.salt);
  }

  async signIn(user) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }

  async login(data: UserLoginDto): Promise<{ token: string }> {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!findUser) {
      throw new HttpException(
        'Users credentials are wrong. Please сheck your email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!(await this.compareHash(data.password, findUser.password))) {
      throw new HttpException(
        'Users credentials are wrong. Please сheck your email or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.signIn(findUser);

    return { token };
  }

  async loginSocial(data: UserLoginSocialDto) {
    try {
      const oAuthClient = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );

      const result = await oAuthClient.verifyIdToken({
        idToken: data.accessToken,
      });

      const tokenPayload = result.getPayload();
      const token = await this.signIn({ id: tokenPayload.sub });

      return { token };
    } catch (e) {
      throw new HttpException('Google auth failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async compareHash(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
