import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';
import { User } from '../user/user.entity';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
      session: false,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.JWT_TTL,
        },
        verifyOptions: {
          clockTolerance: 60,
          maxAge: process.env.JWT_TTL,
        },
      }),
    }),
  ],
  providers: [AuthService, BearerStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
