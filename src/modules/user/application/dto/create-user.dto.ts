import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../domain/models/enums';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	// @IsStrongPassword()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(Role)
	@IsOptional()
	role?: Role;
}
