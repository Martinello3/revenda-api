import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { items, ...saleData } = createSaleDto;
    
    // Calculate total value
    const totalValue = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Create sale
    const sale = this.saleRepository.create({
      ...saleData,
      totalValue,
    });
    
    const savedSale = await this.saleRepository.save(sale);
    
    // Create sale items
    const saleItems = items.map(item => 
      this.saleItemRepository.create({
        ...item,
        saleId: savedSale.id,
      })
    );
    
    await this.saleItemRepository.save(saleItems);
    
    return this.findOne(savedSale.id);
  }

  findAll(status?: string) {
    const where = status ? { status } : {};
    return this.saleRepository.find({
      where,
      relations: ['customer', 'store', 'items'],
      order: { date: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.saleRepository.findOne({
      where: { id },
      relations: ['customer', 'store', 'items'],
    });
  }

  findByCustomer(customerId: number) {
    return this.saleRepository.find({
      where: { customerId },
      relations: ['customer', 'store', 'items'],
      order: { date: 'DESC' },
    });
  }

  findByStore(storeId: number) {
    return this.saleRepository.find({
      where: { storeId },
      relations: ['customer', 'store', 'items'],
      order: { date: 'DESC' },
    });
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return this.saleRepository.update(id, updateSaleDto);
  }

  updateStatus(id: number, status: string) {
    return this.saleRepository.update(id, { status });
  }

  remove(id: number) {
    return this.saleRepository.delete(id);
  }
}
