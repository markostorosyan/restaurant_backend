import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtTokenService } from './services/jwt-token.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.publicKey,
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [ApiConfigService, JwtTokenService],
  exports: [ApiConfigService, JwtTokenService],
})
export class SharedModule {}
