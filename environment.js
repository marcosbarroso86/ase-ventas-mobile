import Constants from 'expo-constants';

const MODE = {
    dev: "development",
    test: "testing",
    uat: "uat",
    prod: "production"
};

const ENV = {
    local: {
        EXECUTIVE_API_HOST: 'http://localhost:8080',
        PROCEDURE_API_HOST: 'http://localhost:8081',
        COMPANY_API_HOST: 'http://localhost:8082',
        NOTIFICATION_API_HOST: 'http://localhost:8083',
        EXECUTIVE_BASE_URL: "/api/public/executives",
        PROCEDURE_BASE_URL: "/api/public/procedures",
        PROSPECT_BASE_URL: "/api/public/procedures/prospects",
        INTEGRATION_BASE_URL: "/api/public/integrations",
        NOTIFICATION_BASE_URL: "/api/public/notifications"
    },
    dev: {
        EXECUTIVE_API_HOST: 'http://ase-ventas-ui-aseventas-dev.apps.openshift.ase.local',
        PROCEDURE_API_HOST: 'http://ase-ventas-ui-aseventas-dev.apps.openshift.ase.local',
        COMPANY_API_HOST: 'http://ase-ventas-ui-aseventas-dev.apps.openshift.ase.local',
        NOTIFICATION_API_HOST: 'http://ase-ventas-ui-aseventas-dev.apps.openshift.ase.local',
        EXECUTIVE_BASE_URL: "/api/public/executives",
        PROCEDURE_BASE_URL: "/api/public/procedures",
        PROSPECT_BASE_URL: "/api/public/procedures/prospects",
        INTEGRATION_BASE_URL: "/api/public/integrations",
        NOTIFICATION_BASE_URL: "/api/public/notifications"
    },
    test: {
        EXECUTIVE_API_HOST: 'https://api01-test-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        PROCEDURE_API_HOST: 'https://api01-test-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        COMPANY_API_HOST: 'https://api01-test-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        NOTIFICATION_API_HOST: 'https://api01-test-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        EXECUTIVE_BASE_URL: "/executives/",
        PROCEDURE_BASE_URL: "/procedures/",
        PROSPECT_BASE_URL: "/procedures/prospects",
        INTEGRATION_BASE_URL: "/integrations/",
        NOTIFICATION_BASE_URL: "/notifications/",
        USER_KEY: '0456cbf64252389198a22bf83d3395e1'
    },
    uat: {
        EXECUTIVE_API_HOST: 'https://api01-uat-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        PROCEDURE_API_HOST: 'https://api01-uat-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        COMPANY_API_HOST:'https://api01-uat-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        NOTIFICATION_API_HOST: 'https://api01-uat-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        EXECUTIVE_BASE_URL: "/executives/",
        PROCEDURE_BASE_URL: "/procedures/",
        PROSPECT_BASE_URL: "/procedures/prospects/",
        INTEGRATION_BASE_URL: "/integrations/",
        NOTIFICATION_BASE_URL: "/notifications/",
        USER_KEY: '6349a3079d31a579fa573025a4b3195d'
    },
    production: {
        EXECUTIVE_API_HOST: 'https://api01-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        PROCEDURE_API_HOST: 'https://api01-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        COMPANY_API_HOST:'https://api01-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        NOTIFICATION_API_HOST: 'https://api01-3scale.apps.openshift.aseconecta.com.ar/aseVentasApi',
        EXECUTIVE_BASE_URL: "/executives/",
        PROCEDURE_BASE_URL: "/procedures/",
        PROSPECT_BASE_URL: "/procedures/prospects/",
        INTEGRATION_BASE_URL: "/integrations/",
        NOTIFICATION_BASE_URL: "/notifications/",
        USER_KEY: '023098a0c87c5e322aa422ef4bf2b234'
    }
}

export default () => {
    const releaseChannel = Constants.manifest.releaseChannel;

    if (releaseChannel === undefined || releaseChannel.indexOf('development') !== -1) {
        // no releaseChannel (is undefined) in dev
         return ENV.test ; // dev env settings
      }
      if (releaseChannel.indexOf('testing') !== -1) {
        // matches test-v1, test-v2
        return ENV.test; // test env settings
    }
    if (releaseChannel.indexOf('uat') !== -1) {
      // matches uat-v1, uat-v2
      return ENV.uat; // uat env 
    }
    if (releaseChannel.indexOf('prod') !== -1) {
      // matches prod-v1, prod-v2, prod-v3
      return ENV.production; // prod env settings
    }
}
