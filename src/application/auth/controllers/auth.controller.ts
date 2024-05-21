import {
  BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: UserRegisterDto, description: 'The user registration data' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async register(@Body() userRegisterDto: UserRegisterDto) {
      try {
        const tokens = await this.authService.register(userRegisterDto);
        return { access_token: tokens.access_token };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Log in an existing user' })
    @ApiBody({ type: UserLogInDto, description: 'The user login data' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async logIn(@Body() userLogInDto: UserLogInDto) {
      try {
        const tokens = await this.authService.logIn(userLogInDto);
        return { access_token: tokens.access_token };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    @Post('check')
    @UseGuards(AutGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async check() {
      return true;
    }
  }