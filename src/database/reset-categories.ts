import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../modules/category/entities/category.entity';

async function reset() {
  const app = await NestFactory.create(AppModule);
  const categoryRepository = app.get(getRepositoryToken(Category));

  // Remove all existing categories
  await categoryRepository.clear();

  // Define default categories
  const defaultCategories = [
    {
      name: 'Weed',
    },
    {
      name: 'Pesticides',
    },
    {
      name: 'Fertilizers',
    },
  ];

  // Insert categories
  for (const category of defaultCategories) {
    const newCategory = categoryRepository.create(category);
    await categoryRepository.save(newCategory);
    console.log(`Created category: ${category.name}`);
  }

  console.log('Categories reset and recreated successfully');
  await app.close();
}

reset();
