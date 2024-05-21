import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../utils/services/hash.service';
import { JwtPayload, Tokens } from '../types';
import { UserService } from 'src/application/user/services/user.service';
import { UserRegisterDto } from '../DTOS/common/user-register-dto';
import { UserLogInDto } from '../DTOS/common/user-logIn-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async logIn(userLogInDto: UserLogInDto) {
    const user = await this.userService.findOneByEmail(userLogInDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await this.hashService.compare(
      userLogInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password or email');
    }

    return await this.getTokens({
      uuid: user.uuid,
      userName: user.userName,
      email: user.email,
      password: user.password,
      role: user.role,
      sub: user.id,
    });
  }

  async register(userRegister: UserRegisterDto): Promise<Tokens> {
    const { email, userName, password, role } = userRegister;

    // Validar que todos los campos estén presentes
    if (!email || !userName || !password || !role) {
      throw new BadRequestException('All fields are required');
    }

    // Validar el formato de email
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validar longitud mínima de contraseña
    if (password.length < 8) {
      throw new BadRequestException('Password should be at least 8 characters long');
    }

    // Validar si el email ya está registrado
    await this.validateEmailForSignUp(email);

    // Hash de la contraseña
    const hashedPassword = await this.hashService.hash(password);

    // Crear el usuario
    const newUser = await this.userService.create({
      email,
      userName,
      password: hashedPassword,
      role,
    });

    // Generar tokens
    return await this.getTokens({
      uuid: newUser.uuid,
      userName: newUser.userName,
      email: newUser.email,
      password: newUser.password, // No recomendado enviar la contraseña en el payload del token
      role: newUser.role,
      sub: newUser.id,
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not set');
    }
    const accessTokenOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    };

    const accessToken = await this.signToken(
      jwtPayload,
      secretKey,
      accessTokenOptions,
    );

    return { access_token: accessToken };
  }

  async signToken(payload: JwtPayload, secretKey: string, options: any) {
    return await this.jwtService.signAsync(payload, {
      secret: secretKey,
      ...options,
    });
  }

  async validateEmailForSignUp(email: string): Promise<boolean | undefined> {
    const user = await this.userService.findOneByEmailRegister(email);

    if (user) {
      throw new HttpException('Email already exists!', 400);
    }
    return true;
  }
}