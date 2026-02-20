import { IsEmail, IsString, MinLength } from 'class-validator'


export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'Password is too short, minimum length is 6 characters'
	})
	@IsString()
	password: string
}