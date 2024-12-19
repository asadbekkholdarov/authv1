import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from './dto/create-user.dto'
import { UserResponseType } from './types/user.response';
import { LoginUserDto } from './dto/login-user.dto';
import { ExpressRequest } from './middleware/auth.middleware';
import { Request } from '@nestjs/common';
import { UserEntity } from './user.entity';
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService){}

  @Post('users')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseType>{
    const user = await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('users/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserResponseType>{
    const user = await this.userService.loginUser(loginUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Get('user')
  async currentUser(@Request() req: ExpressRequest) {
    if(!req.user){
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    return this.userService.buildUserResponse(req.user)
  }
}
