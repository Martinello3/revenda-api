import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accessory } from './accessory.entity';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Injectable()
export class AccessoryService {
  constructor(
    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
  ) {}

  create(createAccessoryDto: CreateAccessoryDto) {
    const accessory = this.accessoryRepository.create(createAccessoryDto);
    return this.accessoryRepository.save(accessory);
  }

  findAll() {
    return this.accessoryRepository.find({
      relations: ['compatiblePhones'],
    });
  }

  findOne(id: number) {
    return this.accessoryRepository.findOne({
      where: { id },
      relations: ['compatiblePhones'],
    });
  }

  findByCategory(category: string) {
    return this.accessoryRepository.find({
      where: { category },
      relations: ['compatiblePhones'],
    });
  }

  findInStock() {
    return this.accessoryRepository
      .createQueryBuilder('accessory')
      .where('accessory.stock > 0')
      .getMany();
  }

  update(id: number, updateAccessoryDto: UpdateAccessoryDto) {
    return this.accessoryRepository.update(id, updateAccessoryDto);
  }

  updateStock(id: number, quantity: number) {
    return this.accessoryRepository
      .createQueryBuilder()
      .update(Accessory)
      .set({ stock: () => `stock + ${quantity}` })
      .where('id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return this.accessoryRepository.delete(id);
  }
}
