db = db.getSiblingDB('campaigns');
db.createCollection('templates');

dbSeed = db.getSiblingDB('seed');

dbSeed.createCollection('campaigns');
dbSeed.campaigns.insertOne({
  id: 'd70904b7-be6d-4e5b-a60b-ebfb237b6a5d',
  title: 'test',
  type: 'dynamic',
  from: 'grace.zaborski+aether@beamery.com',
  touchpoints: [
    {
      subject: 'test',
      rules: {
        AND: [
          {
            condition: 'NOT_REPLIED',
          },
        ],
        OR: [],
      },
      delay: {
        tz: 'Europe/London',
      },
      unlayer: {
        json: {},
        previewUrl: null,
        html: ' ',
      },
      recipientVariables: [],
      modules: [],
      first: true,
      id: 'dY96IOUhaW',
      createdBy: '4e5c39290c1f97a95c75',
      createdAt: {
        $date: {
          $numberLong: '1663149258430',
        },
      },
    },
  ],
  version: 2,
  companyId: '427cd31dbb0c78500714',
  createdBy: '4e5c39290c1f97a95c75',
  createdAt: {
    $date: {
      $numberLong: '1663149258430',
    },
  },
});

dbSeed.createCollection('companies');

dbSeed.companies.insertOne({
  id: '427cd31dbb0c78500714',
  uniqueId: '427cd31dbb0c78500714',
  name: 'Developer Company',
  created_at: '2020-02-04T09:26:14.006Z',
  settings: {
    widget: {
      btnFixed: false,
      btnFloating: true,
      btnPosition: 'right',
      btnSize: 'large',
      btnText: "We're Hiring",
      themeColor: '#1BB7A6',
      includeCSS: true,
      signup: {
        title: 'We are always looking to meet amazing people.',
        copy: 'If you’re interested in opportunities, joining our team or just want to find out more, signup to join our talent community',
      },
      thankyou: {
        title: 'awesome!',
        copy: 'thank you for starting your journey with us',
        tagline:
          'We\'re excited to get to know you and will be in touch very soon.<br class="hidden-xs"> Make sure to check your email',
      },
      reachOut: {
        question: {
          text: 'Which team are you interested in?',
          placeholder: 'What interests you about us?',
        },
        optionalQuestion: {
          text: 'Ask us anything!',
          placeholder: "We'd love to answer any questions you might have.",
        },
      },
    },
    pages: {
      companyName: 'Aether Dev Company',
      companyLogoUrl:
        'https://cdn.fs.beamery.com/api/file/CuGrq2eBQEee2ym1RDZL',
      companyHref:
        'https://image.shutterstock.com/z/stock-vector-cute-smiling-welsh-corgi-dog-vector-cartoon-illustration-isolated-on-pink-background-funny-i-love-1014458896.jpg',
      companyColors: {
        primary: '#A100FF',
      },
      companySlug: 'aether-dev-company_qa_',
      links: {},
      socialLoginProviders: ['linkedin', 'facebook', 'github', 'google'],
      analytics: [],
      customFooter: {
        toggles: [],
        links: [
          {
            link_name: 'TestLink',
            link_URL: 'https://itc.ua',
            valid_url: ['https://itc.ua'],
            valid_name: true,
          },
          {
            link_name: '',
            link_URL: '',
            valid_url: false,
            valid_name: false,
          },
        ],
        social_media: {
          youtube: 'channel/UCGvWJ87XQ8g61E06lgD1WUw',
          facebook: 'qwetqtwqt',
          twitter: 'qwetewqt',
          linkedin: 'qwetewqte',
          instagram: 'wqtewqtwq',
          glassdoor: 'qwetwqt',
          wechat: 'ewqtewqqw',
        },
        siteNotice:
          '<p fr-original-style="" style="box-sizing: inherit; margin: 0px 0px 10px;"><a fr-original-style="" href="http://%3Cscript%20src=%22https%3A//analytics.talentegy.com/b0b495ff-9230-4880-ae45-%20%209568f4cd8b7e.js%22%20type=%22text/javascript%22%3E%3C/script%3E" style="background-color: transparent; user-select: auto; box-sizing: inherit; color: rgb(49, 179, 164); font-weight: 700; text-decoration: none;">&lt;script src="https://analytics.talentegy.com/b0b495ff-9230-4880-ae45- 9568f4cd8b7e.js" type="text/javascript"&gt;</a></p>',
      },
      customSignup: {
        h1: 'https://itc.uaUPD',
        body: '<p style="margin:0px;color:rgb(34, 34, 34);font-family:Arial, Helvetica, sans-serif;font-size:small;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;box-sizing:inherit"> &lt;script src="<a href="https://analytics.talentegy.com/b0b495ff-9230-4880-ae45-9568f4cd8b7e.js" style="color:rgb(17, 85, 204);background-color:transparent;user-select:auto;box-sizing:inherit;font-weight:700;text-decoration:none" target="_blank">https://analytics.<wbr style="box-sizing:inherit"></wbr>talentegy.com/b0b495ff-9230-<wbr style="box-sizing:inherit"></wbr>4880-ae45-9568f4cd8b7e.js</a>" type="text/javascript"&gt;&lt;/<wbr style="box-sizing:inherit"></wbr>script&gt; . </p><h1 style="font-size:2em;margin:0.67em 0px;box-sizing:inherit">Helloupd</h1><p style="box-sizing:inherit">Yusyuan / Nikhil testing - 6</p><p style="box-sizing:inherit"><br style="box-sizing:inherit" /></p>',
      },
      companyFonts: {},
      cookieConsent: {
        apiKeys: {
          events: 'ffb73ca2-ed59-4fb8-ac3c-bd030c5e658f',
          flows: '4e759bfc-7f32-49e1-96c8-028d57d9c70d',
          pages: '30047a5b-5d96-45d4-a598-195280e181b3',
        },
        cdn: 'cdn.cookielaw.org',
        settingsButtonCss:
          'font-family: Arial;\n        -webkit-text-size-adjust: none;\n        font-size: 1em;\n        color: #000;\n        margin: auto;\n        text-decoration: none;\n        position: relative;\n        background-color: #yellow;\n        background-repeat: no-repeat;\n        border: solid;\n        border-color: #333;\n        cursor: pointer;\n        overflow: hidden;\n        border-width: 1px;\n        padding: 10px;\n        border-radius: 8px;\n        position: fixed;\n        right: 2px;\n        bottom: 2px;\n        z-index: 1;',
        enabled: false,
        provider: 'onetrust',
        test: false,
      },
      fileStack: {
        limitedToMyComputer: true,
      },
    },
    gdpr: {
      privacyPolicyUrl: 'https://careers.google.com/privacy-policy/',
      showDataEnrichmentLink: false,
      consentQuestion:
        '<p style="box-sizing:inherit;margin:0px 0px 10px">I accept the consent statement aether.</p>',
      consentRequestIntroductionStatement:
        '<p style="box-sizing:inherit;margin:0px 0px 10px"><style type="text/css" style="box-sizing:inherit"></style><style type="text/css" style="box-sizing:inherit"></style></p><p style="box-sizing:inherit;margin:0px 0px 10px">I understand that the information I submit in this form will be used in accordance with Google\'s applicant and candidate <a href="http://www.google.com/about/careers/privacy" rel="noopener noreferrer" style="background-color:transparent;box-sizing:inherit;color:rgb(49, 179, 164);font-weight:700;text-decoration:none;text-decoration-skip:objects;-webkit-user-select:auto" target="_blank">privacy policy</a>, and I consent to the processing of my information as described in that policy including that in limited circumstances, Google may share my contact information with trusted third parties (such as a student group or university staff) for event planning purposes (such as facilitating check-in to an event).</p><p style="box-sizing:inherit;margin:0px 0px 10px"><br style="box-sizing:inherit" /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><span style="color:rgb(0, 0, 0);font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;box-sizing:inherit">I acknowledge that I have read the Google </span><a href="https://buildyourfuture.withgoogle.com/resources/participant-code-of-conduct/" rel="noopener noreferrer" style="box-sizing:inherit;background-color:rgb(255, 255, 255);color:rgb(49, 179, 164);font-weight:700;text-decoration:none;font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;text-decoration-skip:objects;-webkit-user-select:auto" target="_blank">Code of Conduct</a><span style="color:rgb(0, 0, 0);font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;box-sizing:inherit"> and agree to the expectations it sets forth.</span></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br style="box-sizing:inherit" /></p>',
    },
    compliances: [
      {
        privacyPolicyUrl: 'https://careers.google.com/privacy-policy/',
        showDataEnrichmentLink: false,
        consentQuestion:
          '<p style="box-sizing:inherit;margin:0px 0px 10px">I accept the consent statement aether.</p>',
        consentRequestIntroductionStatement:
          '<p style="box-sizing:inherit;margin:0px 0px 10px"><style type="text/css" style="box-sizing:inherit"></style><style type="text/css" style="box-sizing:inherit"></style></p><p style="box-sizing:inherit;margin:0px 0px 10px">I understand that the information I submit in this form will be used in accordance with Google\'s applicant and candidate <a href="http://www.google.com/about/careers/privacy" rel="noopener noreferrer" style="background-color:transparent;box-sizing:inherit;color:rgb(49, 179, 164);font-weight:700;text-decoration:none;text-decoration-skip:objects;-webkit-user-select:auto" target="_blank">privacy policy</a>, and I consent to the processing of my information as described in that policy including that in limited circumstances, Google may share my contact information with trusted third parties (such as a student group or university staff) for event planning purposes (such as facilitating check-in to an event).</p><p style="box-sizing:inherit;margin:0px 0px 10px"><br style="box-sizing:inherit" /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><span style="color:rgb(0, 0, 0);font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;box-sizing:inherit">I acknowledge that I have read the Google </span><a href="https://buildyourfuture.withgoogle.com/resources/participant-code-of-conduct/" rel="noopener noreferrer" style="box-sizing:inherit;background-color:rgb(255, 255, 255);color:rgb(49, 179, 164);font-weight:700;text-decoration:none;font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;text-decoration-skip:objects;-webkit-user-select:auto" target="_blank">Code of Conduct</a><span style="color:rgb(0, 0, 0);font-family:-apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;box-sizing:inherit"> and agree to the expectations it sets forth.</span></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br /></p><p style="box-sizing:inherit;margin:0px 0px 10px"><br style="box-sizing:inherit" /></p>',
        id: '022d4988-9fcd-409c-a47e-59675fc87d6e',
        isDefault: true,
        name: 'Default',
        privacyPolicyText: 'Privacy Policy',
      },
    ],
    campaigns: {
      unsubscribe: {
        url: {
          htmlSimple:
            '<a clicktracking=off href="https://custom.beamery.com/unsbscribe?contact=%contactId%" target="_blank">THIS IS A TEST CUSTOM UNSUBSCRIBE</a>',
          html: '<span>THIS IS A TEST CUSTOM UNSUBSCRIBE <a clicktracking=off href="https://custom.beamery.com/unsbscribe?contact=%contactId%" target="_blank">unsubscribe</a></span>',
          rv: [
            {
              variable: 'contactId',
              template: '%contactId%',
            },
          ],
        },
      },
    },
    vanityDomains: ['testvanity.beamery.tech'],
  },
  plan: {
    inherit: 'basic',
    override: {
      users: {
        limit: 300,
      },
      contacts: {
        limit: 100000,
      },
      contacts_per_message: {
        limit: 20000,
      },
      contacts_per_bulk_action: {
        limit: 100000,
      },
      reporting: {
        limit: null,
      },
      reporting_data_explorer: {
        limit: null,
      },
      reporting_time_delta_metrics: {
        limit: null,
      },
      teams: {
        limit: null,
      },
      team_selection: {
        limit: null,
      },
      timeinterval_trigger: {
        limit: null,
      },
      recipes: {
        limit: null,
      },
      recipes2: {
        limit: null,
      },
      repeat_recipes: {
        limit: null,
      },
      recipe_actions_cf: {
        limit: null,
      },
      vacancies: {
        limit: null,
      },
      pools: {
        limit: null,
      },
      pools2: {
        limit: null,
      },
      activities: {
        limit: null,
      },
      csv: {
        limit: null,
      },
      global_tags: {
        limit: null,
      },
      closest_connections: {
        limit: null,
      },
      private_fields: {
        limit: null,
      },
      gdpr: {
        limit: null,
      },
      team_leaderboard: {
        limit: null,
      },
      beamery_5: {
        limit: null,
      },
      app_homepage: {
        limit: null,
      },
      boolean_search: {
        limit: null,
      },
      super_admins: {
        limit: null,
      },
      filters: {
        limit: null,
      },
      filter_historical_vacancy_stages: {
        limit: null,
      },
      notifications_mentions: {
        limit: null,
      },
      suggested_contacts_pools: {
        limit: null,
      },
      pools3: {
        limit: null,
      },
      bulk_messaging: {
        limit: null,
      },
      integrations_nylas_emails: {
        limit: null,
      },
      integrations_nylas_calendars: {
        limit: null,
      },
      reporting_vacancy_pipeline: {
        limit: null,
      },
      portal_vacancies: {
        limit: null,
      },
      campaigns: {
        limit: null,
      },
      campaigns_touchpoint_analytics: {
        limit: null,
      },
      campaigns_filters: {
        limit: null,
      },
      templates: {
        limit: null,
      },
      pages: {
        limit: null,
      },
      pages_block_customization: {
        limit: null,
      },
      forms: {
        limit: null,
      },
      surveys: {
        limit: null,
      },
      beta_custom_footer: {
        limit: null,
      },
      flows: {},
      reply_tracking_address_only: {
        limit: null,
      },
      sms_messaging: {
        limit: null,
      },
      events: {
        limit: null,
      },
      events_checkin: {
        limit: null,
      },
      confidentiality: {
        limit: null,
      },
      confidentiality_sharing: {
        limit: null,
      },
      sourcing: {
        limit: null,
      },
      gdpr_automation: {
        limit: null,
      },
    },
    base: {
      users: {
        limit: 5,
      },
      messages: {
        limit: 25000,
      },
      contacts: {
        limit: 10000,
      },
      activities: {},
      attachments: {},
      campaigns: {},
      closest_connections: {},
      company_fields_groups: {},
      csv: {},
      digests: {},
      global_tags: {},
      integrations_nylas_calendars: {},
      integrations_nylas_emails: {},
      integrations_greenhouse: {},
      pools: {},
      recipes: {},
      reply_tracking_address_only: {},
      super_admins: {},
      teams: {},
      templates: {},
      vacancies: {},
    },
    allow: {
      users: {
        limit: 305,
      },
      messages: {
        limit: 25000,
      },
      contacts: {
        limit: 110000,
      },
      activities: {
        limit: null,
      },
      attachments: {},
      campaigns: {
        limit: null,
      },
      closest_connections: {
        limit: null,
      },
      company_fields_groups: {},
      csv: {
        limit: null,
      },
      digests: {},
      global_tags: {
        limit: null,
      },
      integrations_nylas_calendars: {
        limit: null,
      },
      integrations_nylas_emails: {
        limit: null,
      },
      integrations_greenhouse: {},
      pools: {
        limit: null,
      },
      recipes: {
        limit: null,
      },
      reply_tracking_address_only: {
        limit: null,
      },
      super_admins: {
        limit: null,
      },
      teams: {
        limit: null,
      },
      templates: {
        limit: null,
      },
      vacancies: {
        limit: null,
      },
      contacts_per_message: {
        limit: 20000,
      },
      contacts_per_bulk_action: {
        limit: 100000,
      },
      reporting: {
        limit: null,
      },
      reporting_data_explorer: {
        limit: null,
      },
      reporting_time_delta_metrics: {
        limit: null,
      },
      team_selection: {
        limit: null,
      },
      timeinterval_trigger: {
        limit: null,
      },
      recipes2: {
        limit: null,
      },
      repeat_recipes: {
        limit: null,
      },
      recipe_actions_cf: {
        limit: null,
      },
      pools2: {
        limit: null,
      },
      private_fields: {
        limit: null,
      },
      gdpr: {
        limit: null,
      },
      team_leaderboard: {
        limit: null,
      },
      beamery_5: {
        limit: null,
      },
      app_homepage: {
        limit: null,
      },
      boolean_search: {
        limit: null,
      },
      filters: {
        limit: null,
      },
      filter_historical_vacancy_stages: {
        limit: null,
      },
      notifications_mentions: {
        limit: null,
      },
      suggested_contacts_pools: {
        limit: null,
      },
      pools3: {
        limit: null,
      },
      bulk_messaging: {
        limit: null,
      },
      reporting_vacancy_pipeline: {
        limit: null,
      },
      portal_vacancies: {
        limit: null,
      },
      campaigns_touchpoint_analytics: {
        limit: null,
      },
      campaigns_filters: {
        limit: null,
      },
      pages: {
        limit: null,
      },
      pages_block_customization: {
        limit: null,
      },
      forms: {
        limit: null,
      },
      surveys: {
        limit: null,
      },
      beta_custom_footer: {
        limit: null,
      },
      flows: {},
      sms_messaging: {
        limit: null,
      },
      events: {
        limit: null,
      },
      events_checkin: {
        limit: null,
      },
      confidentiality: {
        limit: null,
      },
      confidentiality_sharing: {
        limit: null,
      },
      sourcing: {
        limit: null,
      },
      gdpr_automation: {
        limit: null,
      },
    },
  },
  roles: {
    super_admin: {
      name: 'Super Admin',
      description:
        'This is the role with the highest permission level. Super Admins have full administrative control and visibility over the Beamery System.',
      color: '#6790d4',
      id: '65589591-9204-4549-a07e-7dc9c5cfccce',
    },
    restricted: {
      name: 'Restricted',
      description:
        'Restricted users have the most limited level of access. They can only view public candidates or candidates who have been shared with them, and write notes.',
      color: '#f47988',
      id: '8bb3a95e-0308-48bf-8b99-a6b07e2f9432',
    },
    admin: {
      name: 'Sourcing Admin',
      description:
        'This role gives users full access to CRM and Recipes, and the associated Campaigns, Reporting, Automation Settings and Contact Management. The user has no access to Pages, Forms or the Marketing suite.',
      color: '#6790d4',
      id: '73fc75dd-2756-4dd5-8f44-ebab78f7a64a',
    },
    limited: {
      name: 'Sourcing Limited',
      description:
        'This role has limited permissions. Users can access contacts shared with them, or in shared pools. They cannot access Marketing modules, or Reporting.',
      color: '#ffbe40',
      id: '43157e16-4ed5-41bf-8ec2-53ef6cbb7069',
    },
    marketing_team_member: {
      name: 'Marketing Standard',
      description:
        'Users with this role have broad access to the Marketing suite and CRM, including Campaigns. They cannot create or edit Recipes, or publish Pages and Forms.',
      color: '#50b871',
      id: '66b4653d-5b82-4698-8db1-1c25e6729a86',
    },
    marketing_admin: {
      name: 'Marketing Admin',
      description:
        'This role has similar permissions to Super Admins. Marketing Admins can access all Marketing Suite modules, and also create vacancies. They cannot create or edit Beamery fields like Global Tags or Vacancy Stages.',
      color: '#6790d4',
      id: '7f29495a-1547-494c-b5f5-4f48aeae3d1a',
    },
    team_member: {
      name: 'Sourcing Standard',
      description:
        'This role provides access to the CRM, including Reporting, Contact Management and Campaigns. Users with this role cannot access Pages and Forms, Marketing, Recipes or create email templates.',
      color: '#50b871',
      id: '93ffaf23-d5ec-4cad-b937-e9b97acc434f',
    },
    marketing_limited: {
      name: 'Marketing Limited',
      description:
        'This role is suitable for users who need oversight. They can only see contacts shared with them or in public pools, and can only create and send campaigns for their own personal workflows.',
      color: '#ffbe40',
      id: '6deae192-c156-4f70-986e-643c523af82d',
    },
    confidential: {
      name: 'Sourcing Confidential',
      description:
        'Ideal for Executive Search workflows, users with this role have all the access of Sourcing Standard users, and can additionally create and share confidential candidates.',
      color: '#f47988',
      id: 'e2238118-d542-4415-9e5f-d09a37a28b89',
    },
    recruiter_confidential: {
      name: 'Recruiter Confidential',
      description:
        'Users with this role can do everything a Sourcing Confidential role can, except using CSV imports. The Recruiting Confidential role also has the ability to use the Events module and establish contact relationships.',
      color: '#f47988',
      id: '51074e46-e0e8-4c14-9757-077ef689f0dc',
    },
    recruiter_team_member: {
      name: 'Recruiter Standard',
      description:
        'This role is similar to the Sourcing Standard role, but with the additional ability to use the Events module. Users with this role have the same limitations as a Sourcing Standard role, with the additional limitation of not being able to use CSV Imports.',
      color: '#50b871',
      id: '8525837d-3ca9-4cc7-9474-d82eb0815ecd',
    },
  },
  templateName: 'basic',
  integrations: {
    ___sendGrid: {},
    __sendGrid: {},
    vanityUrls: {},
  },
});
