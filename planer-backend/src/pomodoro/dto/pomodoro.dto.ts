import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

export class PomodoroSessionDto {
	@IsOptional()
	@IsBoolean()
	isComplited?: boolean
}

export class PomodoroRoundDto {
	@IsNumber()
	totalSeconds: number

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean
}