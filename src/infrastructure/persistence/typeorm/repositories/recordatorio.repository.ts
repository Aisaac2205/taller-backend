import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RecordatorioEntity,
  EstadoRecordatorio,
} from '@domain/entities/recordatorio.entity';
import { IRecordatorioRepository } from '@application/ports/recordatorio.repository';
import { RecordatorioTypeormEntity } from '../entities/recordatorio.typeorm';

@Injectable()
export class RecordatorioRepository implements IRecordatorioRepository {
  constructor(
    @InjectRepository(RecordatorioTypeormEntity)
    private readonly recordatorioDb: Repository<RecordatorioTypeormEntity>
  ) {}

  async crear(recordatorio: RecordatorioEntity): Promise<RecordatorioEntity> {
    const recordatorioDb = this.recordatorioDb.create({
      id: recordatorio.id,
      vehiculoId: recordatorio.vehiculoId,
      clienteId: recordatorio.clienteId,
      tipoRecordatorio: recordatorio.tipoRecordatorio,
      kmProximo: recordatorio.kmProximo,
      fechaProxima: recordatorio.fechaProxima,
      descripcion: recordatorio.descripcion,
      estado: recordatorio.estado,
    });
    const resultado = await this.recordatorioDb.save(recordatorioDb);
    return this.mapearADominio(resultado);
  }

  async obtenerPorId(id: string): Promise<RecordatorioEntity | null> {
    const recordatorio = await this.recordatorioDb.findOne({ where: { id } });
    return recordatorio ? this.mapearADominio(recordatorio) : null;
  }

  async obtenerTodos(): Promise<RecordatorioEntity[]> {
    const recordatorios = await this.recordatorioDb.find();
    return recordatorios.map((r) => this.mapearADominio(r));
  }

  async obtenerPorVehiculo(vehiculoId: string): Promise<RecordatorioEntity[]> {
    const recordatorios = await this.recordatorioDb.find({
      where: { vehiculoId },
    });
    return recordatorios.map((r) => this.mapearADominio(r));
  }

  async obtenerPorCliente(clienteId: string): Promise<RecordatorioEntity[]> {
    const recordatorios = await this.recordatorioDb.find({
      where: { clienteId },
    });
    return recordatorios.map((r) => this.mapearADominio(r));
  }

  async obtenerPendientes(): Promise<RecordatorioEntity[]> {
    const recordatorios = await this.recordatorioDb.find({
      where: { estado: EstadoRecordatorio.PENDIENTE },
    });
    return recordatorios.map((r) => this.mapearADominio(r));
  }

  async actualizar(recordatorio: RecordatorioEntity): Promise<RecordatorioEntity> {
    await this.recordatorioDb.update(
      { id: recordatorio.id },
      {
        estado: recordatorio.estado,
        actualizadoEn: new Date(),
      }
    );
    const actualizado = await this.recordatorioDb.findOneOrFail({
      where: { id: recordatorio.id },
    });
    return this.mapearADominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.recordatorioDb.delete({ id });
  }

  private mapearADominio(
    recordatorioDb: RecordatorioTypeormEntity
  ): RecordatorioEntity {
    return new RecordatorioEntity({
      id: recordatorioDb.id,
      vehiculoId: recordatorioDb.vehiculoId,
      clienteId: recordatorioDb.clienteId,
      tipoRecordatorio: recordatorioDb.tipoRecordatorio as
        | 'CAMBIO_ACEITE'
        | 'MANTENIMIENTO',
      kmProximo: recordatorioDb.kmProximo,
      fechaProxima: recordatorioDb.fechaProxima,
      descripcion: recordatorioDb.descripcion,
      estado: recordatorioDb.estado as EstadoRecordatorio,
      creadoEn: recordatorioDb.creadoEn,
      actualizadoEn: recordatorioDb.actualizadoEn,
    });
  }
}

