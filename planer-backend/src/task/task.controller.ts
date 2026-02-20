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
import { TaskService } from './task.service';
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { TaskDto } from './dto/task.dto'

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAllTasks(@CurrentUser('id') userId: string) {
		return this.taskService.getAllTasksByUser(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async createTask(@Body() taskDto: TaskDto, @CurrentUser('id') userId: string) {
		return this.taskService.createTask(taskDto, userId)
	}


	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateTask(@Body() dto: TaskDto, @CurrentUser('id') userId: string, @Param('id') taskId: string){
		return this.taskService.updateTask(dto, taskId, userId)
	}


	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteTask(@Param('id') taskId: string){
		return this.taskService.deleteTask(taskId)
	}
}
