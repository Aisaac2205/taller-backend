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

  @Column('uuid')
  clienteId!: string;

  @ManyToOne(() => ClienteTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente!: ClienteTypeormEntity;

  @Column({ unique: true })
  placa!: string;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column()
  anio!: number;

  @Column()
  kmActual!: number;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
