import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateInterviewDto } from "src/interviews/dto/create-interview.dto";
import { InterviewsService } from "src/interviews/interviews.service";

@Controller("interviews") // Этот декоратор указывает базовый путь для всех методов в этом контроллере
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post() // Этот декоратор указывает, что следующий метод будет обрабатывать POST запросы
  create(@Body() createInterviewDto: CreateInterviewDto) {
    console.log('createInterviewDto', createInterviewDto)
    // Этот метод будет вызываться при POST запросе по адресу /interviews
    return this.interviewsService.create(createInterviewDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.interviewsService.getInterviews(query);
  }
}
