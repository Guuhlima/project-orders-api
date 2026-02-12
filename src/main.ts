import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import 'dotenv/config';
import cors from 'cors';

async function bootstrap() {
  const PORT = process.env.PORT!;
  
  const app = await NestFactory.create(AppModule);

  app.use (cors());
  
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
