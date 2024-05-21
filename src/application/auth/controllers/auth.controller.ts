import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { AutGuard } from '../guard/auth.guard';
  import { Public } from 'src/application/decorators';
  import { AuthService } from '../services/auth.service';
  import { UserRegisterDto} from '../DTOS/common/user-register-dto';
  import { UserLogInDto } from '../DTOS/common/user-logIn-dto';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body() signUpDto: UserRegisterDto) {
      const token = await this.authService.register(signUpDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async logIn(@Body() userLogInDto: UserLogInDto) {
      const token = await this.authService.logIn(userLogInDto);
  
      return { access_token: token.access_token };
    }

    @Post('check')
    @UseGuards(AutGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async check() {
      return true;
    }
  }