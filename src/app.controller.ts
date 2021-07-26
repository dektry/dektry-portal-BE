import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  homePage(): string {
    return "Hello, it seem's like API is ok!";
  }
}
