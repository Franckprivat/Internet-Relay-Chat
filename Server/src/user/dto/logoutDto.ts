import { IsNotEmpty, IsNumber } from "class-validator";

export class logoutDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
