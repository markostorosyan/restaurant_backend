// import { ProductEntity } from '../../product/entities/product.entity';
// import { AbstractEntity } from '../../../common/abstract.entity';
// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { OrderEntity } from './order.entity';

// @Entity({ name: 'order_product_quantities' })
// export class OrderProductQuantityEntity extends AbstractEntity {
//   @Column('uuid')
//   orderId!: Uuid;

//   @Column('uuid')
//   productId!: Uuid;

//   @Column('int')
//   quantity!: number;

//   @ManyToOne(
//     () => OrderEntity,
//     (orderEntity) => orderEntity.ordersProductQuantities,
//     {
//       onUpdate: 'CASCADE',
//       onDelete: 'CASCADE',
//     },
//   )
//   @JoinColumn({ name: 'order_id' })
//   order!: OrderEntity;

// @ManyToOne(
//   () => ProductEntity,
//   (productEntity) => productEntity.ordersProducts,
//   {
//     onUpdate: 'CASCADE',
//     onDelete: 'CASCADE',
//   },
// )
// @JoinColumn({ name: 'product_id' })
// product!: ProductEntity;
// }
