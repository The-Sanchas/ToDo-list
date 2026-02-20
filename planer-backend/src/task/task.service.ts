import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { TaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {

	constructor(private readonly prismaService: PrismaService) {}

	async getAllTasksByUser(userId: string){
		return this.prismaService.task.findMany({
			where: {
				userId
			}
		})
	}

	async createTask(dto: TaskDto, userId: string){
		return this.prismaService.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async updateTask(dto: Partial<TaskDto>, taskId: string, userId: string){
		return this.prismaService.task.update({
			where: {
				id: taskId,
				userId: userId
			},
			data: dto
		})
	}


	async deleteTask(taskId: string){
		return this.prismaService.task.delete({
			where: {
				id: taskId
			}
		})
	}
}
