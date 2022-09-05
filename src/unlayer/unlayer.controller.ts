import { ACL, AuthContext } from '@cerbero/mod-auth';
import { Body, Controller, Post } from '@nestjs/common';
import { UnlayerExportDto } from './dto/unlayer.dto';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UnlayerExportImageResponseDto } from './dto/exportImageResponse.dto';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { UnlayerService } from './unlayer.service';

@ApiTags('unlayer')
@ApiSecurity('api_key')
@Controller('unlayer')
export class UnlayerController {
  constructor(private unlayerService: UnlayerService) {}

  @Post('/export/image')
  @ACL('templates/template:create')
  @ApiOkResponse({ type: UnlayerExportImageResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  async exportImage(
    @Body() unlayerExport: UnlayerExportDto,
    @AuthContext() { companyId },
  ): Promise<UnlayerExportImageResponseDto> {
    return this.unlayerService.generatePreviewImage(unlayerExport, companyId);
  }
}
