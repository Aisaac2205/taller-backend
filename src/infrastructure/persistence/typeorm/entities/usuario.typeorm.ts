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

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'passwordhash' })
  passwordHash!: string;

  @Column()
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'owner', 'mechanic', 'recepcion'],
  })
  rol!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'creadoen' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizadoen' })
  actualizadoEn!: Date;
}

