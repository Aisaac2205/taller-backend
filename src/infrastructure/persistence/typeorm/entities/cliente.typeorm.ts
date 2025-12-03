import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class ClienteTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  nombre!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({ nullable: true })
  direccion!: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}

