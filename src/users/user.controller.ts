import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Creates a new user. This endpoint is protected by JWT authentication.
   * 
   * @param {CreateUserDto} createUserDto - The DTO containing user creation data.
   * @returns {Promise<User>} - The created user.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Retrieves a list of all users. This endpoint is protected by JWT authentication.
   * 
   * @returns {Promise<User[]>} - A list of all users.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Retrieves the profile of the currently authenticated user. This endpoint is protected by JWT authentication.
   * 
   * @param {Request} req - The request object containing user information.
   * @returns {Promise<User>} - The profile of the authenticated user.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const user = await this.userService.findOneById(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Retrieves a specific user by ID. This endpoint is protected by JWT authentication.
   * 
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} - The user with the given ID.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  /**
   * Updates a specific user by ID. This endpoint is protected by JWT authentication.
   * 
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The DTO containing updated user data.
   * @returns {Promise<User>} - The updated user.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Deletes a specific user by ID. This endpoint is protected by JWT authentication.
   * 
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<User>} - The deleted user.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
