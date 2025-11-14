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

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}

