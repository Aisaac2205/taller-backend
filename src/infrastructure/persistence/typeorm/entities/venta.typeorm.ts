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

  @Column('uuid')
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity)
  @JoinColumn({ name: 'clienteId' })
  cliente!: ClienteTypeormEntity;

  @Column('uuid')
  usuarioId!: string;

  @ManyToOne(() => UsuarioTypeormEntity)
  @JoinColumn({ name: 'usuarioId' })
  usuario!: UsuarioTypeormEntity;

  @Column('jsonb')
  detalles!: Array<{
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }>;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADA', 'CANCELADA'],
  })
  estado!: string;

  @Column('decimal', { precision: 12, scale: 2 })
  costoTotal!: number;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  completadaEn!: Date | null;
}
