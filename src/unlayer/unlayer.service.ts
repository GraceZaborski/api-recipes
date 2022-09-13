import { Injectable } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CompaniesService } from '../companies/companies.service';
import { UserService } from '../user/user.service';
import { getAllConfigs } from './custom-tools';

@Injectable()
export class UnlayerService {
  userService: UserService;
  companiesService: CompaniesService;
  campaignsService: CampaignsService;

  constructor(
    userService: UserService,
    companiesService: CompaniesService,
    campaignsService: CampaignsService,
  ) {
    this.userService = userService;
    this.companiesService = companiesService;
    this.campaignsService = campaignsService;
  }

  public async getCustomJsByCampaignId({ campaignId }) {
    if (!campaignId) {
      return getAllConfigs({});
    }

    const { companyId, createdBy: userId } =
      await this.campaignsService.findOne(campaignId);

    const user = await this.userService.getUser({ id: userId, companyId });
    const company = await this.companiesService.findOne(companyId);

    return getAllConfigs({ user, company });
  }

  public async getCustomJsByUserCompany({ userId, companyId }) {
    if (!userId || !companyId) {
      return getAllConfigs({});
    }

    const user = await this.userService.getUser({ id: userId, companyId });
    const company = await this.companiesService.findOne(companyId);

    return getAllConfigs({ user, company });
  }
}
