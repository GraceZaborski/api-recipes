import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ACL, AuthContext } from '@cerbero/mod-auth';
import { FilterQueryDto, PaginatedCampaigns } from './dto';
import { CampaignsService } from './campaigns.service';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Logger } from '../logger';
import { ErrorResponseDto } from '../common/dto/errorResponse.dto';
import { TransformInterceptor } from '../interceptors/classTransformer.interceptor';
import { HydrateUserDataInterceptorFactory } from '../interceptors/hydrateUserData.interceptor';

@ApiTags('campaigns')
@ApiSecurity('api_key')
@Controller('campaigns')
export class CampaignsController {
  constructor(
    private campaignService: CampaignsService,
    private logger: Logger,
  ) {
    this.logger.setContext('CampaignController');
  }

  @Get()
  @ACL.Some('campaigns/campaign:view', 'campaigns/campaign:view_all')
  @UseInterceptors(new TransformInterceptor(PaginatedCampaigns))
  @ApiOkResponse({ type: PaginatedCampaigns })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @UseInterceptors(
    HydrateUserDataInterceptorFactory({
      idPropertyName: 'createdBy',
      collectionPath: 'results',
    }),
  )
  public async getAllCampaigns(
    @Query() filterQuery: FilterQueryDto,
    @AuthContext() { companyId },
  ) {
    return this.campaignService.findAll({
      ...filterQuery,
      companyId,
    });
  }
}
