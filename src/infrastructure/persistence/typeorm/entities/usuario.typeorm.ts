import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class UsuarioTypeormEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ name: 'passwordhash', nullable: true })
  passwordHash!: string;

  @Column({ nullable: true })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'owner', 'mechanic', 'recepcion'],
    nullable: true,
  })
  rol!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}

