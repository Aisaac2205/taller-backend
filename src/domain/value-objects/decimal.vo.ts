export class Decimal {
  private readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value)) {
      throw new Error('Decimal must be a finite number');
    }
    this.value = Math.round(value * 100) / 100;
  }

  public getValue(): number {
    return this.value;
  }

  public add(other: Decimal): Decimal {
    return new Decimal(this.value + other.getValue());
  }

  public subtract(other: Decimal): Decimal {
    return new Decimal(this.value - other.getValue());
  }

  public multiply(factor: number): Decimal {
    return new Decimal(this.value * factor);
  }

  public equals(other: Decimal): boolean {
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value.toFixed(2);
  }
}

