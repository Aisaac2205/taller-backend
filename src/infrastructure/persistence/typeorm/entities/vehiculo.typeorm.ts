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

@Entity('vehiculos')
export class VehiculoTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'clienteid' })
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteid' })
  cliente!: ClienteTypeormEntity;

  @Column({ unique: true, nullable: true })
  placa!: string;

  @Column({ nullable: true })
  marca!: string;

  @Column({ nullable: true })
  modelo!: string;

  @Column({ nullable: true })
  anio!: number;

  @Column({ name: 'kmactual', nullable: true })
  kmActual!: number;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}
