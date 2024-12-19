import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../user.entity';
import {verify} from 'bcrypt'
export interface ExpressRequest extends Request {
  user?: UserEntity
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userEntity: UserEntity){}
  async use(req: Request, res: Response, next: NextFunction) {
    if(!req.headers['authorization']){
      req.user = null
      next()
      return 
    }

    const token = req.header['authorization'].split(' ')[1]
    try {
      const decode = verify(token, 'JWT_SECRET') as {email: string}
      const user = await this.userEntity.findByEmail(decode.email)
      req.user = null
      next()
    } catch {
      req.user = null
    }
  }
  
}
