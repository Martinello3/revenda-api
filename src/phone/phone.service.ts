import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from './phone.entity';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private phoneRepository: Repository<Phone>,
  ) {}

  create(createPhoneDto: CreatePhoneDto) {
    const phone = this.phoneRepository.create(createPhoneDto);
    return this.phoneRepository.save(phone);
  }

  findAll() {
    return this.phoneRepository.find({
      relations: ['brand', 'accessories'],
    });
  }

  findOne(id: number) {
    return this.phoneRepository.findOne({
      where: { id },
      relations: ['brand', 'accessories'],
    });
  }

  findByBrand(brandId: number) {
    return this.phoneRepository.find({
      where: { brandId },
      relations: ['brand', 'accessories'],
    });
  }

  update(id: number, updatePhoneDto: UpdatePhoneDto) {
    return this.phoneRepository.update(id, updatePhoneDto);
  }

  remove(id: number) {
    return this.phoneRepository.delete(id);
  }
}
