import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoTypeormEntity } from './producto.typeorm';

@Entity('movimientos_kardex')
export class MovimientoKardexTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'productoid' })
  productoId!: string;

  @ManyToOne(() => ProductoTypeormEntity)
  @JoinColumn({ name: 'productoid' })
  producto!: ProductoTypeormEntity;

  @Column({
    type: 'enum',
    enum: ['ENTRADA', 'SALIDA'],
  })
  tipo!: string;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'preciounitario' })
  precioUnitario!: number;

  @Column('decimal', { precision: 12, scale: 2, name: 'totalmovimiento' })
  totalMovimiento!: number;

  @Column()
  razon!: string;

  @Column({ nullable: true, name: 'referenciaid' })
  referenciaId!: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;
}
