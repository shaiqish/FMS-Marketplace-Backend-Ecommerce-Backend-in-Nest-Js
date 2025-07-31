import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../modules/category/entities/category.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const categoryRepository = app.get(getRepositoryToken(Category));

  // Check if categories exist
  const existingCategories = await categoryRepository.find();
  if (existingCategories.length > 0) {
    console.log('Categories already exist, skipping seed');
    await app.close();
    return;
  }

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

  console.log('Categories seeded successfully');
  await app.close();
}

bootstrap();
