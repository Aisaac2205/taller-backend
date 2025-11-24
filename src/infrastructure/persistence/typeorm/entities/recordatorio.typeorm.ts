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

  @Column({
    type: 'enum',
    enum: ['CAMBIO_ACEITE', 'MANTENIMIENTO'],
    name: 'tiporecordatorio',
  })
  tipoRecordatorio!: string;

  @Column({ name: 'kmproximo' })
  kmProximo!: number;

  @Column({ name: 'fechaproxima' })
  fechaProxima!: Date;

  @Column()
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
  })
  estado!: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}
