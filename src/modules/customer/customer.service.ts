import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerWithThisEmailAlreadyExistExceptions } from './exceptions/customer-with-this-email-already-exist.exception';
import { CustomerNotFoundExceptions } from './exceptions/customer-not-found.exception';
import { comparePassword, hashPassword } from '../../utils';
import { CustomerLoginDto } from '../auth/dto/customer-login.dto';
import { TokenDto } from '../../common/dto/token.dto';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { CustomerDto } from './dto/customer.dto';
import { TokenTypeEnum } from '../../constants/token-type.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<TokenDto> {
    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.email = :email', { email: createCustomerDto.email })
      .getOne();

    if (customerEntity) {
      throw new CustomerWithThisEmailAlreadyExistExceptions();
    }

    const customerHashPassword = await hashPassword(createCustomerDto.password);
    const newCustomerEntity = this.customerRepository.create({
      ...createCustomerDto,
      password: customerHashPassword,
      role: RoleTypeEnum.CUSTOMER,
    });
    await this.customerRepository.save(newCustomerEntity);

    const customerToken: TokenDto = {
      id: newCustomerEntity.id,
      email: newCustomerEntity.email,
      role: newCustomerEntity.role,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };

    return customerToken;
  }

  async login(customerLoginDto: CustomerLoginDto): Promise<TokenDto> {
    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.email = :email', { email: customerLoginDto.email })
      .getOne();

    if (!customerEntity) {
      throw new CustomerNotFoundExceptions();
    }

    await comparePassword(customerLoginDto.password, customerEntity.password);

    const customerToken: TokenDto = {
      id: customerEntity.id,
      email: customerEntity.email,
      role: customerEntity.role,
      type: TokenTypeEnum.ACCESS_TOKEN,
    };

    return customerToken;
  }

  async findAll(): Promise<CustomerDto[]> {
    const customerEntities = await this.customerRepository
      .createQueryBuilder('customer')
      .select([
        'customer.id',
        'customer.firstName',
        'customer.lastName',
        'customer.email',
        'customer.phoneNumber',
        'customer.createdAt',
        'customer.updatedAt',
      ])
      .getMany();

    return customerEntities;
  }

  async findOne(id: Uuid): Promise<CustomerDto> {
    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .getOne();

    if (!customerEntity) {
      throw new CustomerNotFoundExceptions();
    }

    return customerEntity.toDto();
  }

  async getMe(id: Uuid): Promise<CustomerDto> {
    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .getOne();

    if (!customerEntity) {
      throw new CustomerNotFoundExceptions();
    }

    return customerEntity.toDto();
  }

  async update(
    id: Uuid,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const customerEntity = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .getOne();

    if (!customerEntity) {
      throw new CustomerNotFoundExceptions();
    }

    this.customerRepository.merge(customerEntity, updateCustomerDto);
    await this.customerRepository.save(customerEntity);

    return customerEntity.toDto();
  }

  async delete(id: Uuid): Promise<void> {
    await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .delete()
      .execute();
  }
}
