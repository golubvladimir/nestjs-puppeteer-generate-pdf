import { Controller, Get, Response } from '@nestjs/common';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(
    private readonly pdfGeneratorService: PdfGeneratorService
  ) {}

  @Get('document')
  async getDocument(
    @Response() res
  ) {
    const documentBuffer = await this.pdfGeneratorService.getDocument();

    return res
      .set('Content-Type', 'application/octet-stream')
      .set(
        'Content-Disposition',
        `inline; filename="document.pdf"`
      )
      .send(documentBuffer);
  }

  @Get('document-with-cover')
  getDocumentWithCover() {
    return this.pdfGeneratorService.getDocumentWithCover();
  }
}