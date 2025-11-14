import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VehiculoTypeormEntity } from './vehiculo.typeorm';
import { ClienteTypeormEntity } from './cliente.typeorm';
import { UsuarioTypeormEntity } from './usuario.typeorm';

@Entity('servicios')
export class ServicioTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  vehiculoId!: string;

  @ManyToOne(() => VehiculoTypeormEntity)
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo!: VehiculoTypeormEntity;

  @Column('uuid')
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity)
  @JoinColumn({ name: 'clienteId' })
  cliente!: ClienteTypeormEntity;

  @Column('uuid')
  mecanicoId!: string;

  @ManyToOne(() => UsuarioTypeormEntity)
  @JoinColumn({ name: 'mecanicoId' })
  mecanico!: UsuarioTypeormEntity;

  @Column()
  kmRegistrado!: number;

  @Column()
  descripcion!: string;

  @Column('jsonb')
  detalles!: Array<{
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }>;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'],
  })
  estado!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  costoTotal!: number;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  completadoEn!: Date | null;
}
