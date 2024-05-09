import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { AtGuard } from '../guards/at.guard';
  import { Public } from 'src/libs/decorators';
  import { AuthService } from '../services/auth.service';
  import { UserRegisterDto} from '../DTOS/common/requests/user-register-dto';
  import { UserLogInDto } from '../DTOS/common/requests/user-logIn-dto';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    /* 
    This method handles POST /auth/register requests. It's decorated with @Public(), meaning it can be accessed without authentication. It takes a SignUpDto object from the request body, passes it to AuthService.register(), and returns the resulting access token.
    */
    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() signUpDto: UserRegisterDto) {
      const token = await this.authService.register(signUpDto);
      return { access_token: token.access_token };
    }
  
    /* 
    This method handles POST /auth/login requests. Like register, it's also public. It takes a UserLoginDto object from the request body, passes it to AuthService.logIn(), and returns the resulting access token.
    */
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async logIn(@Body() userLogInDto: UserLogInDto) {
      const token = await this.authService.logIn(userLogInDto);
  
      return { access_token: token.access_token };
    }
  }