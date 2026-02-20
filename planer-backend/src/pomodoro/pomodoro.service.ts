import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from 'src/user/user.service';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';

@Injectable()
export class PomodoroService {

	constructor(private readonly prismaService: PrismaService, private readonly userService: UserService){}

	async getTodaySessions(userId: string) {

		const today = new Date().toISOString().split('T')[0]

		return this.prismaService.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				rounds: {
					orderBy: {
						id: "desc"
					}
				}
			}
		})
	}

	async createPomadoroSession(userId: string) {
		const todaySession = await this.getTodaySessions(userId)

		if(todaySession) return todaySession

		const user = await this.userService.getUserById(userId)

		if(!user) throw new NotFoundException('Usser not found')

		return this.prismaService.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0
						}))
					}
				},
				user: {
					connect: {
						id: userId
					}
				}	
			},
			include: {
				rounds: true
			}
		})
	}

	async updateRoundTime(
		dto: Partial<PomodoroSessionDto>,
		pomodoroId: string,
		userId: string
	){

		return this.prismaService.pomodoroSession.update({
			where: {
				userId,
				id: pomodoroId
			},
			data: dto
		})
	}


	async updateRound(
		dto: Partial<PomodoroRoundDto>,
		roundId: string
	) {

		return this.prismaService.pomodoroRound.update({
			where: {
				id: roundId
			},
			data: dto
		})
	}

	async deleteSession(sessionId: string, userId: string){
		return this.prismaService.pomodoroSession.delete({
			where: {
				id: sessionId,
				userId
			}
		})
	}
}
