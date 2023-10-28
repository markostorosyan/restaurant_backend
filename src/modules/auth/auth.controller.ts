import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  // UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { LoginPayloadDto } from '../../dto/login-payload.dto';
// import { AuthGuard } from '@nestjs/passport';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { CustomerDto } from '../customer/dto/customer.dto';
import { AdminDto } from '../admin/dto/admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { Auth } from '../../guards/auth.guard';
import { AuthUser } from '../../common/auth-user.decorator';
import { TokenDto } from '../../dto/token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('customer-login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CustomerLoginDto, description: 'Customer Login' })
  customerLogin(
    @Body() customerLoginDto: CustomerLoginDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.customerLogin(customerLoginDto);
  }

  @Post('customer-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateCustomerDto, description: 'Create customer' })
  customerRegistration(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.customerRegistration(createCustomerDto);
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AdminLoginDto, description: 'Customer Login' })
  adminLogin(@Body() adminLoginDto: AdminLoginDto): Promise<LoginPayloadDto> {
    return this.authService.adminLogin(adminLoginDto);
  }

  @Post('admin-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CreateAdminDto, description: 'Create customer' })
  adminRegistration(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.adminRegistration(createAdminDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'get your page ' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  getMe(@AuthUser() user: TokenDto): Promise<CustomerDto | AdminDto> {
    return this.authService.getMe(user.id, user.role);
  }
}
