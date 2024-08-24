import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsBoolean,
  IsOptional,
  Min,
  MinLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

// Define the valid blood types
enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(BloodType)
  @IsNotEmpty()
  bloodType: BloodType;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsEnum(['Male', 'Female', 'Other'])
  @IsNotEmpty()
  gender: string;

  @IsNumber()
  @Min(50)
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @Min(12.5)
  @IsOptional()
  hemoglobinLevel: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastDonationDate?: Date;

  @IsString()
  @IsOptional()
  medicalConditions?: string;

  @IsString()
  @IsOptional()
  recentSurgeriesMedications?: string;

  @IsString()
  @IsOptional()
  infectiousDiseases?: string;

  @IsString()
  @IsOptional()
  recentVaccinations?: string;

  @IsString()
  @IsOptional()
  travelHistory?: string;

  @IsString()
  @IsOptional()
  pregnancyHistory?: string;

  @IsBoolean()
  @IsOptional()
  consent?: boolean;

  @IsString()
  @IsOptional()
  resetToken?: string;
  
  @IsDate()
  @IsOptional()
  resetTokenExpiry?: Date;
}
