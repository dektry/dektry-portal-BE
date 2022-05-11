import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private EmployeeService: EmployeeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getEmployeesList(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('field') field?: string,
  ) {
    return this.EmployeeService.getEmployeesList(limit, page, order, field);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getEmployee(@Param('id') id: string) {
    return this.EmployeeService.getEmployee(id);
  }
}
