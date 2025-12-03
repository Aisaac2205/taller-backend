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

  @Column('uuid', { name: 'vehiculoid' })
  vehiculoId!: string;

  @ManyToOne(() => VehiculoTypeormEntity)
  @JoinColumn({ name: 'vehiculoid' })
  vehiculo!: VehiculoTypeormEntity;

  @Column('uuid', { name: 'clienteid' })
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity)
  @JoinColumn({ name: 'clienteid' })
  cliente!: ClienteTypeormEntity;

  @Column('uuid', { name: 'mecanicoid' })
  mecanicoId!: string;

  @ManyToOne(() => UsuarioTypeormEntity)
  @JoinColumn({ name: 'mecanicoid' })
  mecanico!: UsuarioTypeormEntity;

  @Column({ name: 'kmregistrado' })
  kmRegistrado!: number;

  @Column({ nullable: true })
  descripcion!: string;

  @Column('jsonb', { nullable: true })
  detalles!: Array<{
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }>;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'],
    nullable: true,
  })
  estado!: string;

  @Column('decimal', { precision: 12, scale: 2, name: 'costototal', nullable: true })
  costoTotal!: number;

  @Column({ default: 'GENERAL', nullable: true })
  tipo!: string;

  @Column({ name: 'proximocambiokm', nullable: true })
  proximoCambioKm!: number;

  @Column({ name: 'proximocambiofecha', nullable: true, type: 'timestamp' })
  proximoCambioFecha!: Date;

  @Column({ name: 'piezareemplazada', nullable: true })
  piezaReemplazada!: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;

  @Column({ nullable: true, type: 'timestamp', name: 'completadoen' })
  completadoEn!: Date | null;
}
