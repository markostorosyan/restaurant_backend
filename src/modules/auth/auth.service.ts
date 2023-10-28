import { Injectable } from '@nestjs/common';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerService } from '../customer/customer.service';
import { LoginPayloadDto } from '../../dto/login-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminService } from '../admin/admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { RoleTypeEnum } from 'src/constants/role-type.enum';
import { CustomerDto } from '../customer/dto/customer.dto';
import { AdminDto } from '../admin/dto/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async customerLogin(
    customerLoginDto: CustomerLoginDto,
  ): Promise<LoginPayloadDto> {
    const customerLogin = await this.customerService.login(customerLoginDto);
    const token = await this.jwtService.signAsync(customerLogin);

    return new LoginPayloadDto(token);
  }

  async customerRegistration(
    createCustomerDto: CreateCustomerDto,
  ): Promise<LoginPayloadDto> {
    const customerRegistration =
      await this.customerService.create(createCustomerDto);
    const token = await this.jwtService.signAsync(customerRegistration);

    return new LoginPayloadDto(token);
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<LoginPayloadDto> {
    const adminLogin = await this.adminService.login(adminLoginDto);
    const token = await this.jwtService.signAsync(adminLogin);

    return new LoginPayloadDto(token);
  }

  async adminRegistration(
    createAdminDto: CreateAdminDto,
  ): Promise<LoginPayloadDto> {
    const adminRegistration = await this.adminService.create(createAdminDto);
    const token = await this.jwtService.signAsync(adminRegistration);

    return new LoginPayloadDto(token);
  }

  async getMe(id: Uuid, role: RoleTypeEnum): Promise<CustomerDto | AdminDto> {
    if (role === RoleTypeEnum.ADMIN) {
      return await this.adminService.getMe(id);
    }
    return await this.customerService.getMe(id);
  }
}
