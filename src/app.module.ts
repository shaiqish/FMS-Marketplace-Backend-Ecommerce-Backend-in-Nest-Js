import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'src/config/dbConfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads', // 👈 this sets the URL path
      exclude: ['/api*'], // 👈 optional: avoids interfering with APIs
    }),
    CategoryModule,
    UserModule,
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
