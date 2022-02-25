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

      // use production services
      authUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/auth'
      verticalUrlBase = 'https://dcloud-collab-toolbox-rtp.cxdemo.net/api/v1/verticals'
    }

    return {
      webex: authUrlBase + '/resource/joinWebexSupportRoom',
      authVersion: authUrlBase + '/version',
      logout: authUrlBase + '/logout',
      demoInfo: mmUrlBase + '/demo',
      vertical: mmUrlBase + '/verticals',
      provision: authUrlBase + '/provision',
      userDemoConfig: authUrlBase + '/user/demo',
      user: authUrlBase + '/user',
      session: mmUrlBase + '/sessions',
      instance: authUrlBase + '/instance',
      layout: authUrlBase + '/webex-v6/user/desktop-layout/my',
      globalLayout: authUrlBase + '/webex-v6/user/desktop-layout/global',
      image: verticalUrlBase + '/images'
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