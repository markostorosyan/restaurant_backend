import {
  Controller,
  Body,
  Get,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { AccessDeniedException } from '../../exception/access-denied.exception';
import { Auth } from '../../guards/auth.guard';
import { AuthUser } from '../../common/auth-user.decorator';
import { ShortUserDto } from '../../common/dto/short-user.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.ADMIN])
  @ApiOkResponse({ type: CustomerDto, description: 'Get all customers' })
  findAll(): Promise<CustomerDto[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.ADMIN])
  @ApiOkResponse({ type: CustomerDto, description: 'Get customers by id' })
  findOne(@UUIDParam('id') id: Uuid) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.CUSTOMER])
  @ApiOkResponse({ type: CustomerDto, description: 'Get all customers' })
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @AuthUser() user: ShortUserDto,
  ) {
    if (id !== user.id) {
      throw new AccessDeniedException();
    }

    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.CUSTOMER, RoleTypeEnum.ADMIN])
  @ApiOkResponse({ type: CustomerDto, description: 'Get all customers' })
  delete(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: ShortUserDto,
  ): Promise<void> {
    if (user.role === RoleTypeEnum.CUSTOMER && id !== user.id) {
      throw new AccessDeniedException();
    }

    return this.customerService.delete(id);
  }
}
