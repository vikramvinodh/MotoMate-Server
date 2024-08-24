import { Get, Injectable, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    /**
     * Creates a new user with hashed password and returns the created user.
     * 
     * @param {CreateUserDto} createUserDto - DTO containing user creation data.
     * @returns {Promise<User>} - The created user document.
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
            consent: createUserDto.consent || false,  
            createdAt: new Date(),  
        });

        return createdUser.save();
    }

    /**
     * Returns a list of all users in the system.
     * 
     * @returns {Promise<User[]>} - List of user documents.
     */
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    /**
     * Finds and returns a user by their ID.
     * 
     * @param {string} id - The ID of the user.
     * @returns {Promise<User>} - The user document.
     * @throws {NotFoundException} - If the user with the given ID is not found.
     */
    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    /**
     * Updates an existing user with the provided data and returns the updated user.
     * 
     * @param {string} id - The ID of the user to update.
     * @param {UpdateUserDto} updateUserDto - DTO containing updated user data.
     * @returns {Promise<User>} - The updated user document.
     * @throws {NotFoundException} - If the user with the given ID is not found.
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        delete updateUserDto.email
        delete updateUserDto.name

        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return updatedUser;
    }

    /**
     * Removes a user by their ID and returns the deleted user.
     * 
     * @param {string} id - The ID of the user to remove.
     * @returns {Promise<User>} - The deleted user document.
     * @throws {NotFoundException} - If the user with the given ID is not found.
     */
    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return deletedUser;
    }

    /**
     * Finds and returns a user by their email address.
     * 
     * @param {string} email - The email address of the user.
     * @returns {Promise<User | undefined>} - The user document, or undefined if not found.
     */
    async findByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }

    /**
     * Finds and returns a user by their ID.
     * 
     * @param {string} userId - The ID of the user.
     * @returns {Promise<User | undefined>} - The user document, or undefined if not found.
     */
    async findOneById(userId: string): Promise<User | undefined> {
        return this.userModel.findById(userId).exec(); 
    }
}
