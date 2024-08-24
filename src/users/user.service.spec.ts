import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let userService: UserService;
    let userModel: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        new: jest.fn().mockResolvedValue(mockUser),
                        constructor: jest.fn().mockResolvedValue(mockUser),
                        find: jest.fn().mockReturnValue({
                            exec: jest.fn().mockResolvedValue([mockUser]),
                        }),
                        findById: jest.fn().mockResolvedValue(mockUser),
                        findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
                        findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
                        save: jest.fn().mockResolvedValue(mockUser),
                        findOne: jest.fn().mockResolvedValue(mockUser),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userModel = module.get<Model<User>>(getModelToken(User.name));
    });

    const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password',
        save: jest.fn(),
    };

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });


    describe('findAll', () => {
        it('should return all users', async () => {
            const users = await userService.findAll();
            expect(users).toEqual([mockUser]);
        });
    });

    describe('findOne', () => {
        it('should return a user if found', async () => {
            const user = await userService.findOne('user_id');
            expect(user).toEqual(mockUser);
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);
            await expect(userService.findOne('user_id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a user if found', async () => {
            jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const user = await userService.update('user_id', { email: 'updated@example.com' });
            expect(user).toEqual(mockUser);
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(null);
            await expect(userService.update('user_id', { email: 'updated@example.com' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a user if found', async () => {
            jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(mockUser);
            const user = await userService.remove('user_id');
            expect(user).toEqual(mockUser);
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(null);
            await expect(userService.remove('user_id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByEmail', () => {
        it('should return a user if found', async () => {
            const user = await userService.findByEmail('test@example.com');
            expect(user).toEqual(mockUser);
        });
    });
});
