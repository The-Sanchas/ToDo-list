import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { TimeBlockDto } from './dto/time-block.dto'

@Injectable()
export class TimeBlockService {

	constructor( private readonly prismaService: PrismaService) {}

	async getAllTimeBlocks(userId: string){
		return this.prismaService.timeBlock.findMany({
			where: {
				userId
			},
			orderBy: {
				order: 'asc'
			}
		})
	}

	async createTimeBlock(dto: TimeBlockDto, userId: string){

		return this.prismaService.timeBlock.create({
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

	async updateTimeBlock(dto: Partial<TimeBlockDto>, timeBlockId: string, userId: string){

		return  this.prismaService.timeBlock.update({
			where: {
				userId,
				id: timeBlockId
			},
			data: dto
		})
	}

	async deleteTimeBlock(timeBlockId: string, userId: string){
		return this.prismaService.timeBlock.delete({
			where: {
				id: timeBlockId,
				userId
			}
		})
	}

	async updateOrder(ids: string[]){
		return this.prismaService.$transaction(
			ids.map((id, order) => this.prismaService.timeBlock.update({
				where: {id},
				data: {order}
				})
			)
		)
	}
}
