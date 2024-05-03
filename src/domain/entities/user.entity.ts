import { Prop, Schema } from "@nestjs/mongoose";
import { IsEmail, IsString, Length, Matches } from "class-validator";
import { UserRole } from "./role.entity";

@Schema({timestamps: true})
export class User extends Document {
    @Prop({required: true})
    id: number;

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

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: string;
}