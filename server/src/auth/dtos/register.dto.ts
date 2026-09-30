import {
	IsDefined,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsDefined()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string;

	@IsOptional()
	image?: Express.Multer.File | string;
}
