import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { EmployeeService } from '../services/employee.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee.dto';
import { EmployeeEntity } from '../entity/employee.entity';

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
    @Query('query') query?: string,
  ) {
    return this.EmployeeService.getEmployeesList({
      limit,
      page,
      order,
      field,
      query,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getEmployee(@Param('id') id: string) {
    return this.EmployeeService.getEmployee(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateEmployee(
    @Param('id') id: string,
    @Body() updatedEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeEntity | UpdateResult> {
    return this.EmployeeService.updateEmployee(id, updatedEmployee);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<void> {
    return this.EmployeeService.createEmployee(createEmployeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':employeeId')
  deleteEmployee(@Param('employeeId') employeeId: string) {
    return this.EmployeeService.deleteEmployee(employeeId);
  }
}
