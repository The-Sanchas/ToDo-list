import { Controller, Get, HttpCode, Param, Post, Body, UsePipes, ValidationPipe, Put, Delete } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';

@Controller('user/timer')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get('today')
  @Auth()
	async getTodeySession(@CurrentUser('id') userId: string) {
    return this.pomodoroService.getTodaySessions(userId)
  }

  @Post()
  @HttpCode(200)
  @Auth()
  async createSession(@CurrentUser('id') userId: string) {

    return this.pomodoroService.createPomadoroSession(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('/round/:id')
  @Auth()
  async updateRound(@Param('id') roundId: string, @Body() dto: PomodoroRoundDto) {
    return this.pomodoroService.updateRound(dto, roundId)
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateSession(@Body() dto: PomodoroSessionDto, @CurrentUser('id') userId: string, @Param('id') sessionId: string) {

    return this.pomodoroService.updateRoundTime(dto, sessionId, userId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteSession(@Param('id') sessionId: string, @CurrentUser('id') userId: string) {
    return this.pomodoroService.deleteSession(sessionId, userId)
  }


}
