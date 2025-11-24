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

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  email!: string;

  @Column()
  telefono!: string;

  @Column()
  direccion!: string;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}

