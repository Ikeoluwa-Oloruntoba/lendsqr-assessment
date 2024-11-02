import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repository/knex/user.repository';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<{ user: any, accessToken: string }> {

    const {email, password} = data;
    
    const user = await this.usersRepository.findByEmail(email);

    if (!user || !(await this.verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = sign(payload,  process.env.JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'Lendsqr',
    })

    return { user, accessToken };
  }

  async logout(userId: string): Promise<void> {
    // Implement logout logic if using token blacklisting or session management
    // For stateless JWT, this might simply be a no-op
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
    }
    return true;
  }
}
