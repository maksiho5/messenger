import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());

	const port = 4000;
	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
	});

	// Подача статических файлов из папки uploads
	app.useStaticAssets(join(__dirname, '..', 'uploads'), {
		prefix: '/uploads/',
	});

	await app.listen(port);
}

bootstrap();
