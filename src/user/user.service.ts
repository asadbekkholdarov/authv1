import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './user.entity';
import { UserResponseType } from './types/user.response';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';
import {sign} from 'jsonwebtoken'
@Injectable()
export class UserService {
  constructor(@InjectModel(UserEntity.name) private userModel: Model<UserEntity>){}

  
  async createUser(createUserDto: CreateUserDto){
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  buildUserResponse(userEntity: UserEntity) {
    return {
      email: userEntity.email,
      username: userEntity.username,
      token: this.generateJwt(userEntity),
    };
  }

  generateJwt(userEntity: UserEntity): string {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    return sign({ email: userEntity.email }, secret);
  }


  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email }).select('+password')
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPassword = await compare(loginUserDto.password, user.password)
    if (!isPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return (user);
  }

}
