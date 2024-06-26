import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsEnum, IsString, Length, Matches } from "class-validator";
import { UserRole } from "./role.entity";
import { Document } from 'mongoose';
import * as uuid from 'uuid';

@Schema({timestamps: true})
export class User extends Document {

  @Prop({ default: uuid.v4() })
  uuid: string;

  @IsEmail()
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  userName: string;
  
  @Length(8, 128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'password too weak',
  })
  @IsString()
  @Prop({required: true})
  password: string;

  @IsEnum(UserRole)
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function(next) {
  if (!this.uuid) {
    this.uuid = uuid.v4();
  }
  next();
});
