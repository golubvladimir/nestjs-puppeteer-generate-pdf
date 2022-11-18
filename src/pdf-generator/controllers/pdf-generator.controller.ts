import { Controller, Get } from '@nestjs/common';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(
    private readonly pdfGeneratorService: PdfGeneratorService
  ) {}

  @Get('document')
  getDocument() {
    return this.pdfGeneratorService.getDocument();
  }

  @Get('document-with-cover')
  getDocumentWithCover() {
    return this.pdfGeneratorService.getDocumentWithCover();
  }
}