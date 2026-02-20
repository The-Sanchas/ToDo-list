import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { TimeBlockService } from './time-block.service';
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAllTimeBlock(@CurrentUser('id') userId: string) {
		return this.timeBlockService.getAllTimeBlocks(userId)
	}



	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async creatTimeBlock(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string ) {
		return this.timeBlockService.createTimeBlock(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('update-order')
	@Auth()
	async updateOrder(@Body() dto: UpdateOrderDto){
		return this.timeBlockService.updateOrder(dto.ids)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateTimeBlock(
		@Body() dto: TimeBlockDto,
		@CurrentUser('id') userID: string,
		@Param('id') timeBlockId: string){

		return this.timeBlockService.updateTimeBlock(dto, timeBlockId, userID)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteTimeBlock(
		@Param('id') timeBlockId: string,
		@CurrentUser('id') userId: string
	) {

		return this.timeBlockService.deleteTimeBlock(timeBlockId, userId)
	}
}
