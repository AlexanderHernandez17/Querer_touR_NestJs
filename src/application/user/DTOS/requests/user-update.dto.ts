import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../common/create-user-dto';

export class UpdateUserDto extends PartialType(UserDto) {} 