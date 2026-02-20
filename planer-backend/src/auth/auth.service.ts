import {
	BadRequestException,
	NotFoundException,
	UnauthorizedException,
	Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	async login(dto:AuthDto) {

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)

		const token = this.issueTokens(user.id)

		return {
			user,
			...token,
		}
	}

	async register(dto:AuthDto) {

		const oldUser = await this.userService.getByEmail(dto.email)

		if(oldUser) throw new BadRequestException('User already exists')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.createUser(dto)


		const token = this.issueTokens(user.id)

		return {
			user,
			...token,
		}
	}

	async getNewToken(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)

		if(!result) throw new UnauthorizedException('Invalid refresh token')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}

	}


	private  issueTokens(userId: string) {
		const data = {id: userId}

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return {accessToken, refreshToken}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if(!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if(!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	addRefreshTokenToResponse(res: Response, refrashToken: string){

		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.configService.get('EXPIRE_DAY_REFRESH_TOKEN'))

		res.cookie(this.configService.getOrThrow<string>('REFRASH_TOKEN_NAME'), refrashToken, {
			httpOnly: true,
			domain: this.configService.getOrThrow<string>('DOMAIN'),
			expires: expiresIn,
			secure: true,
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response){
		res.cookie(this.configService.getOrThrow<string>('REFRASH_TOKEN_NAME'),'',{
			httpOnly: true,
			domain: this.configService.getOrThrow<string>('DOMAIN'),
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		})
	}


}
