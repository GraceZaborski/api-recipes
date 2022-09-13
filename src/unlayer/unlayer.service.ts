import { Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { UserService } from '../user/user.service';
import { getAllConfigs } from './custom-tools';

@Injectable()
export class UnlayerService {
  userService: UserService;
  companiesService: CompaniesService;

  constructor(userService: UserService, companiesService: CompaniesService) {
    this.userService = userService;
    this.companiesService = companiesService;
  }

  public async getCustomJs({ companyId, userId }) {
    const user = await this.userService.getUser({ id: userId, companyId });
    const company = await this.companiesService.findOne(companyId);

    return getAllConfigs({ user, company });
  }
}
