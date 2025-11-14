# 🏗️ Arquitectura Hexagonal - Taller Backend

## Visión general

Este proyecto implementa **Clean Architecture + Hexagonal (Ports & Adapters)** con **Domain-Driven Design**:

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL WORLD                           │
│         (HTTP Clients, Databases, Services)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │    ADAPTERS (Infrastructure)    │
        │  Controllers, Repositories       │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      PORTS (Interfaces)         │
        │  I*Repository Contracts         │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │   APPLICATION (Orchestration)   │
        │  Use Cases, Business Rules      │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      DOMAIN (Pure Business)     │
        │  Entities, Services, VOs        │
        └────────────────────────────────┘
```

## Capas

### 1. Domain (innermost - sin dependencias externas)

**Responsabilidad:** Encapsular reglas de negocio puras

**Artifacts:**
- `entities/` - Clases que representan conceptos del negocio
- `services/` - Lógica de negocio (cálculos, validaciones)
- `value-objects/` - Immutable types (Decimal, Email)

**Características:**
- ✅ TypeScript puro, sin imports de NestJS
- ✅ No conoce sobre DB, HTTP, frameworks
- ✅ Reutilizable en cualquier contexto (CLI, batch, etc.)

**Ejemplo:**
```typescript
// domain/entities/producto.entity.ts
export class ProductoEntity {
  public obtenerPrecioVentaCalculado(): Decimal {
    const factor = new Decimal(1 + this.margenPorcentaje.getValue() / 100);
    return this.costoUnitario.multiply(factor.getValue());
  }
}

// domain/services/calculo-proximo-cambio.service.ts
export class CalculoProximoCambioService {
  public determinarProxima(kmActual: number, fechaActual: Date) {
    // Lógica pura sin dependencias
  }
}
```

### 2. Application (orchestration)

**Responsabilidad:** Orquestar el dominio para resolver casos de uso

**Artifacts:**
- `ports/` - Interfaces que definen contratos
- `use-cases/` - Logica transaccional, coordinación

**Características:**
- ✅ Depende SOLO de Domain y Ports
- ✅ No importa NestJS, Controllers, TypeORM
- ✅ Testeable sin bases de datos

**Ejemplo:**
```typescript
// application/use-cases/registrar-servicio.use-case.ts
export class RegistrarServicioUseCase {
  constructor(
    private readonly servicioRepository: IServicioRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly calculoService: CalculoProximoCambioService
  ) {}

  async ejecutar(input: RegistrarServicioInput): Promise<ServicioEntity> {
    // 1. Validar datos de negocio
    const producto = await this.productoRepository.obtenerPorId(...);
    
    // 2. Ejecutar lógica de dominio
    producto.descontarStock(cantidad);
    
    // 3. Persistir cambios
    await this.productoRepository.actualizar(producto);
    
    return servicio;
  }
}

// Ports: Contracts sin implementación
export interface IProductoRepository {
  obtenerPorId(id: string): Promise<ProductoEntity | null>;
  actualizar(producto: ProductoEntity): Promise<ProductoEntity>;
}
```

### 3. Infrastructure (outermost - implementaciones concretas)

**Responsabilidad:** Adaptar el mundo externo al core

**Artifacts:**
- `persistence/` - Repositorios TypeORM (implementan Ports)
- `http/` - Controllers, DTOs (adaptan HTTP a Use Cases)
- `auth/` - JWT, Guards
- `schedulers/` - Cron jobs

**Características:**
- ✅ Depende de todo (Domain, Application, externos)
- ✅ Mapea entre TypeORM ↔️ Domain
- ✅ Mapea entre DTOs (HTTP) ↔️ Domain

**Ejemplo:**
```typescript
// infrastructure/persistence/typeorm/repositories/producto.repository.ts
@Injectable()
export class ProductoRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoTypeormEntity)
    private readonly productoDb: Repository<ProductoTypeormEntity>
  ) {}

  async actualizar(producto: ProductoEntity): Promise<ProductoEntity> {
    // Mapear Domain → TypeORM
    const productoDb = this.productoDb.create({
      id: producto.id,
      tipo: producto.tipo,
      // ...
    });
    
    // Persistir
    const resultado = await this.productoDb.save(productoDb);
    
    // Mapear TypeORM → Domain
    return this.mapearADominio(resultado);
  }

  private mapearADominio(productoDb: ProductoTypeormEntity): ProductoEntity {
    return new ProductoEntity({
      id: productoDb.id,
      costoUnitario: new Decimal(productoDb.costoUnitario),
      // ...
    });
  }
}

// infrastructure/http/controllers/productos.controller.ts
@Controller('productos')
export class ProductosController {
  constructor(
    @Inject('IProductoRepository')
    private productoRepository: IProductoRepository
  ) {}

  @Post()
  async crear(@Body() createDto: CreateProductoDto): Promise<any> {
    // Mapear DTO → Domain
    const producto = new ProductoEntity({
      id: uuid(),
      costoUnitario: new Decimal(createDto.costoUnitario),
      // ...
    });

    // Usar repositorio (Dependency Injection)
    const guardado = await this.productoRepository.crear(producto);
    
    // Mapear Domain → Response
    return {
      id: guardado.id,
      precioVentaCalculado: guardado.obtenerPrecioVentaCalculado().getValue(),
      // ...
    };
  }
}
```

## Flujo de una solicitud HTTP

```
1. HTTP POST /servicios
   ↓
2. Controller: RegistrarServicioDto recibido
   ↓
3. Controller: Valida con ValidationPipe (class-validator)
   ↓
4. Controller: Instancia RegistrarServicioUseCase
   ↓
5. Use Case: Pide datos a Repositorio (Puerto)
   ↓
6. Repositorio: Consulta BD, mapea a Domain
   ↓
7. Use Case: Ejecución lógica de dominio (ProductoEntity.descontarStock())
   ↓
8. Use Case: Pide persistencia a Repositorio
   ↓
9. Repositorio: Mapea Domain → TypeORM, guarda en BD
   ↓
10. Use Case: Retorna ServicioEntity
    ↓
11. Controller: Mapea Entity a Response DTO
    ↓
12. HTTP 201 Created + JSON
```

## Ejemplos de inyección de dependencias

### Inyección en Controllers

```typescript
@Controller('clientes')
export class ClientesController {
  constructor(
    @Inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository
  ) {}
  
  @Post()
  async crear(@Body() dto: CreateClienteDto): Promise<any> {
    const cliente = new ClienteEntity({...});
    return await this.clienteRepository.crear(cliente);
  }
}
```

### Inyección en Use Cases

```typescript
export class RegistrarServicioUseCase {
  constructor(
    private readonly servicioRepository: IServicioRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly calculoService: CalculoProximoCambioService
  ) {}
}
```

### Registro de dependencias en módulos

```typescript
@Module({
  providers: [
    {
      provide: 'IProductoRepository',
      useClass: ProductoRepository,  // Implementación concreta
    },
    {
      provide: 'IServicioRepository',
      useClass: ServicioRepository,
    },
  ],
  exports: [
    'IProductoRepository',
    'IServicioRepository',
  ],
})
export class PersistenceModule {}
```

## Ventajas de esta arquitectura

| Aspecto | Beneficio |
|--------|-----------|
| **Testabilidad** | Domain se prueba sin BD. Use Cases sin HTTP. |
| **Independencia de Framework** | Domain no conoce NestJS. Puedo cambiar de framework. |
| **Independencia de BD** | Puedo cambiar PostgreSQL por MongoDB reescribiendo solo Repositorios. |
| **Mantenibilidad** | Código organizado, responsabilidades claras. |
| **Escalabilidad** | Fácil agregar nuevas features sin afectar existentes. |
| **Reutilización** | Use Cases pueden usarse en API REST, GraphQL, CLI, etc. |

## Patrones implementados

### 1. Repository Pattern
```typescript
// Puerto (contrato)
export interface IProductoRepository {
  obtenerPorId(id: string): Promise<ProductoEntity | null>;
  actualizar(producto: ProductoEntity): Promise<ProductoEntity>;
}

// Adaptador (implementación)
@Injectable()
export class ProductoRepository implements IProductoRepository {
  // ...
}
```

### 2. Value Objects
```typescript
// Immutable, validated type
export class Decimal {
  constructor(value: number) {
    if (!Number.isFinite(value)) throw new Error('...');
    this.value = Math.round(value * 100) / 100;
  }
  
  public getValue(): number { return this.value; }
  public multiply(factor: number): Decimal { return new Decimal(...); }
}

// Uso
const precio = new Decimal(100.50); // Valida en construcción
const neto = precio.multiply(1.21);
```

### 3. Entity Aggregates
```typescript
export class ProductoEntity {
  // Encapsula estado y comportamiento
  private stockActual: number;
  
  public descontarStock(cantidad: number): void {
    if (!this.tieneStock(cantidad)) {
      throw new Error('Stock insuficiente');
    }
    this.stockActual -= cantidad;
  }
}
```

### 4. Use Case (Interactor)
```typescript
// Orquesta multiples operaciones
export class RegistrarServicioUseCase {
  async ejecutar(input: RegistrarServicioInput): Promise<ServicioEntity> {
    // Transacción lógica
    const vehiculo = await this.vehiculoRepository.obtenerPorId(...);
    const producto = await this.productoRepository.obtenerPorId(...);
    
    producto.descontarStock(cantidad);
    
    await this.productoRepository.actualizar(producto);
    const servicio = await this.servicioRepository.crear(...);
    const recordatorio = await this.recordatorioRepository.crear(...);
    
    return servicio;
  }
}
```

## Mapeos clave

### Entity Domain ↔️ TypeORM

```typescript
// Domain Entity (pura, sin decoradores)
export class ProductoEntity {
  id: string;
  costoUnitario: Decimal;  // Value Object
  // ...
}

// TypeORM Entity (con decoradores, tipos DB)
@Entity('productos')
export class ProductoTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;
  
  @Column('decimal', { precision: 12, scale: 2 })
  costoUnitario: number;
  // ...
}

// Mapeo en Repositorio
private mapearADominio(db: ProductoTypeormEntity): ProductoEntity {
  return new ProductoEntity({
    id: db.id,
    costoUnitario: new Decimal(db.costoUnitario),  // ← Conversión
  });
}
```

### DTO (HTTP Input) ↔️ Domain Entity

```typescript
// DTO (recibido del cliente)
export class CreateProductoDto {
  @IsEnum(['ACEITE', 'FILTRO', 'OTRO'])
  tipo: string;
  
  @IsNumber()
  costoUnitario: number;
}

// Controller mapea
@Post()
async crear(@Body() dto: CreateProductoDto) {
  const entity = new ProductoEntity({
    id: uuid(),
    tipo: dto.tipo as TipoProducto,  // ← Conversión y validación
    costoUnitario: new Decimal(dto.costoUnitario),
  });
  
  return await this.productoRepository.crear(entity);
}
```

## Testing con esta arquitectura

```typescript
// Test de dominio: Sin mocks, lógica pura
describe('ProductoEntity', () => {
  it('debe calcular precio con margen', () => {
    const producto = new ProductoEntity({
      id: '1',
      costoUnitario: new Decimal(100),
      margenPorcentaje: new Decimal(20),
    });
    
    expect(producto.obtenerPrecioVentaCalculado().getValue()).toBe(120);
  });
});

// Test de use case: Con mocks de repositorios
describe('RegistrarServicioUseCase', () => {
  it('debe descontar stock al registrar', async () => {
    const mockProductoRepo = {
      obtenerPorId: jest.fn().mockResolvedValue(producto),
      actualizar: jest.fn(),
    };
    
    const useCase = new RegistrarServicioUseCase(mockProductoRepo, ...);
    await useCase.ejecutar(input);
    
    expect(mockProductoRepo.actualizar).toHaveBeenCalled();
  });
});

// Test de controller: Con mocks de usecase
describe('ProductosController', () => {
  it('debe retornar 201 al crear producto', async () => {
    const mockRepo = {
      crear: jest.fn().mockResolvedValue(producto),
    };
    
    const result = await controller.crear(dto);
    expect(result.id).toBeDefined();
  });
});
```

## Conclusión

Esta arquitectura permite:
- 🎯 Código **centrado en el negocio** (Domain)
- 🔧 **Fácil de testear** (sin dependencias externas)
- 🔄 **Flexible** (cambiar DB, framework, etc.)
- 📚 **Mantenible** (clara separación de responsabilidades)
- 🚀 **Escalable** (nuevas features sin modificar existentes)

**Clean Code Principle:** "The code should read like a story about the business, not about the technology."

