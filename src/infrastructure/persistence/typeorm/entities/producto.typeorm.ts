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

  @Column({
    type: 'enum',
    enum: ['ACEITE', 'FILTRO', 'OTRO'],
  })
  tipo!: string;

  @Column()
  marca!: string;

  @Column()
  presentacion!: string;

  @Column('decimal', { precision: 12, scale: 2, name: 'costounitario' })
  costoUnitario!: number;

  @Column('decimal', { precision: 5, scale: 2, name: 'margenporcentaje' })
  margenPorcentaje!: number;

  @Column({ name: 'stockactual' })
  stockActual!: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}
