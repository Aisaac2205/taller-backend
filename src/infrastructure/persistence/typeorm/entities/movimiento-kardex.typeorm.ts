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

  @Column('uuid')
  productoId!: string;

  @ManyToOne(() => ProductoTypeormEntity)
  @JoinColumn({ name: 'productoId' })
  producto!: ProductoTypeormEntity;

  @Column({
    type: 'enum',
    enum: ['ENTRADA', 'SALIDA'],
  })
  tipo!: string;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  precioUnitario!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalMovimiento!: number;

  @Column()
  razon!: string;

  @Column({ nullable: true })
  referenciaId!: string;

  @CreateDateColumn()
  creadoEn!: Date;
}
