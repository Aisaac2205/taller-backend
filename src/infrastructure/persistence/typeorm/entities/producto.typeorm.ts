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

  @Column('decimal', { precision: 12, scale: 2 })
  costoUnitario!: number;

  @Column('decimal', { precision: 5, scale: 2 })
  margenPorcentaje!: number;

  @Column()
  stockActual!: number;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
