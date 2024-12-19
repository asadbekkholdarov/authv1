import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { hash } from "bcrypt";
import * as bcrypt from 'bcrypt'
@Schema()
export class UserEntity {
  @Prop()
  email: string

  @Prop()
  username: string

  @Prop({select: false})
  password: string
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity)

UserEntitySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})