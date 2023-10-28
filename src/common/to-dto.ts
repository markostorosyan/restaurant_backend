// import { ProductEntity } from '../modules/product/entities/product.entity';
import { AdminDto } from '../modules/admin/dto/admin.dto';
import { AdminEntity } from '../modules/admin/entities/admin.entity';
import { CustomerDto } from '../modules/customer/dto/customer.dto';
import { CustomerEntity } from '../modules/customer/entities/customer.entity';

export function personToDto(
  entity: CustomerEntity | AdminEntity,
): CustomerDto | AdminDto {
  const dto = {
    id: entity.id,
    email: entity.email,
    firstName: entity.firstName,
    lastName: entity.lastName,
    phoneNumber: entity.phoneNumber,
    role: entity.role,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };

  return dto;
}

// export function productToDto(entity: ProductEntity) {
//   const dto = {
//     productName: entity.productName,
//     price: entity.price,
//     description: entity.description,
//     image: entity.image,
//     categoryId: entity.category_id,
//   };

//   return dto;
// }
