import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/loginDto';
import { logoutDto } from './dto/logoutDto';


// http://localhost:3000/user
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // http://localhost:3000/user/signup
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // http://localhost:3000/user/login
  @Post('login') 
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('logout')
  async logout(@Body() logoutDto: logoutDto) {
    const userId = logoutDto.userId;
    return this.userService.logout(userId);
  }

  // http://localhost:3000/user/all
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  // http://localhost:3000/user/id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

// http://localhost:3000/user/id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // http://localhost:3000/user/id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
