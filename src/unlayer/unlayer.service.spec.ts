import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CompaniesService } from '../companies/companies.service';
import { UserService } from '../user/user.service';
import { UnlayerService } from './unlayer.service';

describe('UnlayerService', () => {
  let service: UnlayerService;
  let userService: UserService;
  let companiesService: CompaniesService;
  let campaignsService: CampaignsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnlayerService,
        {
          provide: CompaniesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CampaignsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UnlayerService>(UnlayerService);
    userService = module.get<UserService>(UserService);
    companiesService = module.get<CompaniesService>(CompaniesService);
    campaignsService = module.get<CampaignsService>(CampaignsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get custom js by campaignId', async () => {
    const user = {
      id: 'userId',
    };

    const company = {
      id: 'companyId',
      name: 'companyName',
      settings: {
        campaigns: {
          unsubscribe: {
            url: {
              html: '<p>hello</p>',
            },
          },
        },
      },
    };

    const campaign = {
      id: 'campaignId',
      companyId: company.id,
      createdBy: user.id,
    };

    jest
      .spyOn(companiesService, 'findOne')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(company)));

    jest
      .spyOn(userService, 'getUser')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(user)));

    jest
      .spyOn(campaignsService, 'findOne')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(campaign)));

    const result = await service.getCustomJsByCampaignId({
      campaignId: campaign.id,
    });

    console.log(result[2]);

    expect(result).toMatchInlineSnapshot(`
      Array [
        "window.unlayer.registerTool({\\"name\\":\\"custom_video\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Video\\",\\"icon\\":\\"fa-film\\",\\"position\\":4,\\"options\\":{\\"video\\":{\\"title\\":\\"Video\\",\\"position\\":1,\\"options\\":{\\"url\\":{\\"label\\":\\"Youtube URL\\",\\"defaultValue\\":\\"\\",\\"widget\\":\\"text\\"},\\"alt\\":{\\"label\\":\\"Alt text\\",\\"defaultValue\\":\\"Video\\",\\"widget\\":\\"text\\"}}}},     renderer: {      Viewer: window.unlayer.createViewer({        render: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }),      exporters: {        email: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"signature\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Signature\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }),      exporters: {        email: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"unsubscribe\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Unsubscribe\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=\\",\\"usageLimit\\":1,     values: {      html: \\"<p>hello</p>\\",    },    renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<p>hello</p>\\",      }),      exporters: {        email: () => \\"<p>hello</p>\\",      }    }  });",
      ]
    `);

    expect(companiesService.findOne).toBeCalledWith('companyId');
    expect(userService.getUser).toBeCalledWith({
      id: user.id,
      companyId: company.id,
    });
    expect(campaignsService.findOne).toBeCalledWith('campaignId');
  });

  it('should be able to get custom js when campaignId=null', async () => {
    const result = await service.getCustomJsByCampaignId({ campaignId: null });

    expect(result).toMatchInlineSnapshot(`
      Array [
        "window.unlayer.registerTool({\\"name\\":\\"custom_video\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Video\\",\\"icon\\":\\"fa-film\\",\\"position\\":4,\\"options\\":{\\"video\\":{\\"title\\":\\"Video\\",\\"position\\":1,\\"options\\":{\\"url\\":{\\"label\\":\\"Youtube URL\\",\\"defaultValue\\":\\"\\",\\"widget\\":\\"text\\"},\\"alt\\":{\\"label\\":\\"Alt text\\",\\"defaultValue\\":\\"Video\\",\\"widget\\":\\"text\\"}}}},     renderer: {      Viewer: window.unlayer.createViewer({        render: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }),      exporters: {        email: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"signature\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Signature\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }),      exporters: {        email: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"unsubscribe\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Unsubscribe\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=\\",\\"usageLimit\\":1,     values: {      html: \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",    },    renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }),      exporters: {        email: () => \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }    }  });",
      ]
    `);
  });

  it('should be able to get custom js by userId and companyId', async () => {
    const user = {
      id: 'userId',
    };

    const company = {
      id: 'companyId',
      name: 'companyName',
      settings: {
        campaigns: {
          unsubscribe: {
            url: {
              html: '<p>hello</p>',
            },
          },
        },
      },
    };

    jest
      .spyOn(companiesService, 'findOne')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(company)));

    jest
      .spyOn(userService, 'getUser')
      .mockResolvedValueOnce(new Promise((resolve) => resolve(user)));

    const result = await service.getCustomJsByUserCompany({
      userId: user.id,
      companyId: company.id,
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        "window.unlayer.registerTool({\\"name\\":\\"custom_video\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Video\\",\\"icon\\":\\"fa-film\\",\\"position\\":4,\\"options\\":{\\"video\\":{\\"title\\":\\"Video\\",\\"position\\":1,\\"options\\":{\\"url\\":{\\"label\\":\\"Youtube URL\\",\\"defaultValue\\":\\"\\",\\"widget\\":\\"text\\"},\\"alt\\":{\\"label\\":\\"Alt text\\",\\"defaultValue\\":\\"Video\\",\\"widget\\":\\"text\\"}}}},     renderer: {      Viewer: window.unlayer.createViewer({        render: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }),      exporters: {        email: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"signature\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Signature\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }),      exporters: {        email: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"unsubscribe\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Unsubscribe\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=\\",\\"usageLimit\\":1,     values: {      html: \\"<p>hello</p>\\",    },    renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<p>hello</p>\\",      }),      exporters: {        email: () => \\"<p>hello</p>\\",      }    }  });",
      ]
    `);

    expect(userService.getUser).toBeCalledWith({
      id: user.id,
      companyId: company.id,
    });
  });

  it('should be able to get custom js when userId and campaignId = null', async () => {
    const result = await service.getCustomJsByUserCompany({
      userId: null,
      companyId: null,
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        "window.unlayer.registerTool({\\"name\\":\\"custom_video\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Video\\",\\"icon\\":\\"fa-film\\",\\"position\\":4,\\"options\\":{\\"video\\":{\\"title\\":\\"Video\\",\\"position\\":1,\\"options\\":{\\"url\\":{\\"label\\":\\"Youtube URL\\",\\"defaultValue\\":\\"\\",\\"widget\\":\\"text\\"},\\"alt\\":{\\"label\\":\\"Alt text\\",\\"defaultValue\\":\\"Video\\",\\"widget\\":\\"text\\"}}}},     renderer: {      Viewer: window.unlayer.createViewer({        render: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }),      exporters: {        email: (values) => {          const defaultImage = '<img src=\\"https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png\\" alt=\\"Video placeholder\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" />';          const videoUrl = values.url;          if (!videoUrl) return defaultImage;          const regex = /(youtu\\\\.be\\\\/|youtube\\\\.com\\\\/(watch\\\\?(.*&)?v=|(embed|v)\\\\/))([^\\\\?&\\\\\\"'>]+)/;          const match = videoUrl.match(regex);          if (match && match[5]) {            return \`<a href=\\"\${videoUrl}\\" target=\\"_blank\\"><img src=\\"https://img.youtube.com/vi/\${match[5]}/0.jpg\\" title=\\"\${values.alt}\\" alt=\\"\${values.alt}\\" style=\\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;\\" width=\\"480\\" class\\"fullwidth\\" border=\\"0\\" /></a>\`;          }          return defaultImage;        },      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"signature\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Signature\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }),      exporters: {        email: () => \\"<div style='height:100%;background-color:rgb(255, 241, 199);padding:10px'><div style='line-height:140%;text-align:center;color:#704d00'><p>You have not created a signature yet.</p><p>You can do this in <strong>Settings</strong>.</p><div style='padding:10px'><img alt='Navigate to settings page' src='https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png' style='max-width:160px'/></div><p>Once you have done that, please try again.</p></div></div>\\",      }    }  });",
        "window.unlayer.registerTool({\\"name\\":\\"unsubscribe\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Unsubscribe\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=\\",\\"usageLimit\\":1,     values: {      html: \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",    },    renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }),      exporters: {        email: () => \\"<p>Don<!-- -->&#x27;<!-- -->t want to receive these e-mails?<!-- --> <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }    }  });",
      ]
    `);
  });
});
