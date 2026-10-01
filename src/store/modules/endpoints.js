const getters = {
  endpoints: (state, getters) => {
    let authUrlBase
    const mmUrlBase = 'https://mm.cxdemo.net/api/v1'
    let verticalUrlBase
    
    if (getters.isProduction) {
      // production
      authUrlBase = '/api/v1/auth'
      verticalUrlBase = '/api/v1/verticals'
    } else {
      // development
      // use local services
      authUrlBase = 'http://localhost:3032/api/v1/auth'
      verticalUrlBase = 'http://localhost:3033/api/v1/verticals'

      // use production services in development
      authUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth'
      verticalUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/verticals'
    }

    return {
      jds: {
        // Local dev looks up the identity with WEBEX_CC_TOKEN.
        // Production uses the login API, which calls the same JDS URL.
        identity: getters.isProduction
          ? authUrlBase + '/webex-v6/jds/identity'
          : 'http://127.0.0.1:5056/jds/identity',
      },
      webex: authUrlBase + '/resource/joinWebexV6SupportRoom',
      authVersion: authUrlBase + '/version',
      logout: authUrlBase + '/logout',
      demoInfo: mmUrlBase + '/demo',
      vertical: mmUrlBase + '/verticals',
      provision: authUrlBase + '/provision',
      resetPassword: authUrlBase + '/webex-v6/user/reset-password',
      userDemoConfig: authUrlBase + '/user/demo',
      user: authUrlBase + '/user',
      session: mmUrlBase + '/sessions',
      instance: authUrlBase + '/instance',
      layout: authUrlBase + '/webex-v6/user/desktop-layout/my',
      globalLayout: authUrlBase + '/webex-v6/user/desktop-layout/global',
      image: verticalUrlBase + '/images',
      imiResend: authUrlBase + '/webex-v6/imi-resend',
      imiChangeEmail: authUrlBase + '/webex-v6/imi-change-email',
      outboundContacts: authUrlBase + '/webex-v6/outbound/contacts',
      outboundProvision: authUrlBase + '/webex-v6/outbound/provision',
      // Local dev calls the Webex Create Contact List API through the dev server.
      // Production still uses the login API, which makes the same Webex call.
      webexCampaignContacts: getters.isProduction
        ? authUrlBase + '/webex-v6/webex-campaign/contacts'
        : 'http://127.0.0.1:5056/contacts',
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}