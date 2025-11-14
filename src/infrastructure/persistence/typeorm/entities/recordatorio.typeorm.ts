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

@Entity('recordatorios')
export class RecordatorioTypeormEntity {
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

  @Column({
    type: 'enum',
    enum: ['CAMBIO_ACEITE', 'MANTENIMIENTO'],
  })
  tipoRecordatorio!: string;

  @Column()
  kmProximo!: number;

  @Column()
  fechaProxima!: Date;

  @Column()
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
  })
  estado!: string;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
