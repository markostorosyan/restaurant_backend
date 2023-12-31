import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminWithThisEmailAlreadyExistExceptions } from './exceptions/admin-with-this-email-already-exist.exception';
import { AdminDto } from './dto/admin.dto';
import { hashPassword, comparePassword } from '../../utils';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { AdminLoginDto } from '../auth/dto/admin-login.dto';
import { AdminNotFoundExceptions } from './exceptions/admin-not-found.exception';
import { TokenDto } from 'src/common/dto/token.dto';
import { TokenTypeEnum } from '../../constants/token-type.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<TokenDto> {
    const adminEntity = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.email = :email', { email: createAdminDto.email })
      .getOne();

    if (adminEntity) {
      throw new AdminWithThisEmailAlreadyExistExceptions();
    }

    const adminHashPassword = await hashPassword(createAdminDto.password);

    const newAdminEntity = this.adminRepository.create({
      ...createAdminDto,
      password: adminHashPassword,
      role: RoleTypeEnum.ADMIN,
    });
    await this.adminRepository.save(newAdminEntity);

    const adminToken: TokenDto = {
      id: newAdminEntity.id,
      email: newAdminEntity.email,
      role: newAdminEntity.role,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };

    return adminToken;
  }

  async login(adminLoginDto: AdminLoginDto): Promise<TokenDto> {
    const email = adminLoginDto.email.toLowerCase();
    const adminEntity = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.email = :email', { email })
      .getOne();

    if (!adminEntity) {
      throw new AdminNotFoundExceptions();
    }
    await comparePassword(adminLoginDto.password, adminEntity.password);

    const adminToken: TokenDto = {
      id: adminEntity.id,
      email: adminEntity.email,
      role: adminEntity.role,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };

    return adminToken;
  }

  async getMe(id: Uuid): Promise<AdminDto> {
    const adminEntity = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.id = :id', { id })
      .getOne();

    if (!adminEntity) {
      throw new AdminNotFoundExceptions();
    }

    return adminEntity.toDto();
  }
}
