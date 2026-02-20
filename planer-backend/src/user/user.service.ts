import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from '../auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user.dto'
import { startOfDay, subDays } from 'date-fns'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {
	}

	async getById(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})
	}

	async getUserById(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id
			},
		})
	}

	async getByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: {email}
		})
	}

	async getProfile(id: string) {

		const profile = await this.getById(id)

		const totalTask = profile.tasks.length
		const completedTasks = await  this.prismaService.task.count({
			where: {
				userId: id,
				isCompleted: true
			}
		})

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		const todayTasks = await this.prismaService.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		})

		const weekTasks = await this.prismaService.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		})

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...rest } = profile

		return {
			user: rest,
			statistics: [
				{ label: 'Total', value: totalTask },
				{ label: 'Completed', value: completedTasks },
				{ label: 'Today tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks },
			]
		}

	}

	async createUser(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password)
		}

		return this.prismaService.user.create({
				data: user
		})
	}

	async updateUser(id: string, dto: UserDto) {

		let data = dto

		if(data.password){
			data = { ...dto, password: await hash(dto.password)}
		}

		return this.prismaService.user.update({
			where:{
				id
			},
			data,
			select: {
				name: true,
				email: true,
			}
		})
	}
}
