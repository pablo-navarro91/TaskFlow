import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Inyección del repositorio de usuarios para interactuar con la base de datos y realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en la entidad User.
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      name,
      email,
      password,
    }); // Crea una nueva instancia de la entidad User utilizando los datos proporcionados (nombre, correo electrónico y contraseña). Esta instancia aún no se ha guardado en la base de datos, solo se ha creado en memoria.

    return this.usersRepository.save(user);
  }
}