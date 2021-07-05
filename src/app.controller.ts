import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  homePage(@Res() res) {
    return res.redirect();
  }
}
