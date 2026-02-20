import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	MinLength
} from 'class-validator'

export class  PomodoroSettingsDto {

	@IsOptional()
	@IsNumber()
	@Min(1)
	workInterval?: number

	@IsOptional()
	@IsNumber()
	@Min(1)
	breakInterval?: number

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(10)
	intervalsCount?: number

}

export class UserDto extends PomodoroSettingsDto {

	@IsOptional()
	@IsEmail()
	email?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsOptional()
	@MinLength(6, {
		message: 'Password is too short, minimum length is 6 characters'
	})
	@IsString()
	password?: string
}