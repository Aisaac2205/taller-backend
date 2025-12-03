import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productos')
export class ProductoTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  nombre!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ nullable: true })
  sku!: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  precio!: number;

  @Column({ nullable: true })
  categoria!: string;

  @Column({ name: 'stock', nullable: true })
  stock!: number;

  // Legacy columns made nullable
  @Column({
    type: 'enum',
    enum: ['ACEITE', 'FILTRO', 'OTRO'],
    nullable: true
  })
  tipo!: string;

  @Column({ nullable: true })
  marca!: string;

  @Column({ nullable: true })
  presentacion!: string;

  @Column('decimal', { precision: 12, scale: 2, name: 'costounitario', nullable: true })
  costoUnitario!: number;

  @Column('decimal', { precision: 5, scale: 2, name: 'margenporcentaje', nullable: true })
  margenPorcentaje!: number;

  @Column({ name: 'stockactual', nullable: true })
  stockActual!: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}
