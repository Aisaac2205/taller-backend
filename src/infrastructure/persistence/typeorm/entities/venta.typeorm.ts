import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClienteTypeormEntity } from './cliente.typeorm';
import { UsuarioTypeormEntity } from './usuario.typeorm';

@Entity('ventas')
export class VentaTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'clienteid' })
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity)
  @JoinColumn({ name: 'clienteid' })
  cliente!: ClienteTypeormEntity;

  @Column('uuid', { name: 'usuarioid' })
  usuarioId!: string;

  @ManyToOne(() => UsuarioTypeormEntity)
  @JoinColumn({ name: 'usuarioid' })
  usuario!: UsuarioTypeormEntity;

  @Column('jsonb', { nullable: true })
  detalles!: Array<{
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }>;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADA', 'CANCELADA'],
    nullable: true,
  })
  estado!: string;

  @Column('decimal', { precision: 12, scale: 2, name: 'costototal', nullable: true })
  costoTotal!: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;

  @Column({ nullable: true, type: 'timestamp', name: 'completadaen' })
  completadaEn!: Date | null;
}
