import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findOne({
      where: { email: email.toLowerCase().trim(), active: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async me(userId: number) {
    const user = await this.users.findOne({ where: { id: userId, active: true } });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  listUsers() {
    return this.users.find({
      select: ['id', 'email', 'name', 'role', 'active', 'createdAt'],
      order: { id: 'ASC' },
    });
  }

  async createSupervisor(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) {
    const email = data.email.toLowerCase().trim();
    const exists = await this.users.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.users.save(
      this.users.create({
        email,
        passwordHash,
        name: data.name.trim(),
        role: data.role || 'supervisor',
        active: true,
      }),
    );
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
    };
  }

  async setActive(id: number, active: boolean) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.role === 'admin' && !active) {
      throw new ConflictException('Cannot deactivate the main admin');
    }
    user.active = active;
    await this.users.save(user);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
    };
  }
}
