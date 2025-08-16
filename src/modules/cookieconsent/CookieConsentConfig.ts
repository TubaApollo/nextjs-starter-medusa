import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import { getBrowserLang } from './getBrowserLang';

const browserLang = getBrowserLang();
const supportedLangs = ['en', 'de'];
const chosenLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      position: 'left',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  onFirstConsent: function () {
    console.log('onFirstAction fired');
  },

  onConsent: function ({ cookie }) {
    console.log('onConsent fired ...');
  },

  onChange: function ({ changedCategories, cookie }) {
    console.log('onChange fired ...');
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)/,
          },
        ],
      },
    },
  },

  language: {
    default: chosenLang,

    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            'Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept explicitly. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Manage preferences</a>',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          footer: `
            <a href="#link">Privacy Policy</a>
            <a href="#link">Impressum</a>
          `,
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie Usage',
              description:
                'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#" class="cc__link">privacy policy</a>.',
            },
            {
              title: 'Strictly necessary cookies',
              description: 'Description',
              linkedCategory: 'necessary',
            },
            {
              title: 'Performance and Analytics cookies',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration',
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a href="#das">Google Analytics</a>.',
                    expiration: 'Expires after 12 days',
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a href="#das">Google Analytics</a>',
                    expiration: 'Session',
                  },
                ],
              },
            },
            {
              title: 'More information',
              description:
                'For any queries in relation to my policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact me</a>.',
            },
          ],
        },
      },

      de: {
        consentModal: {
          title: 'Hallo Reisender, es ist Cookie-Zeit!',
          description:
            'Unsere Website verwendet Tracking-Cookies, um zu verstehen, wie Sie mit ihr interagieren. Das Tracking wird nur aktiviert, wenn Sie ausdrücklich zustimmen. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Einstellungen verwalten</a>',
          acceptAllBtn: 'Alle akzeptieren',
          acceptNecessaryBtn: 'Alle ablehnen',
          showPreferencesBtn: 'Cookie-Einstellungen verwalten',
          footer: `
            <a href="#link">Datenschutzerklärung</a>
            <a href="#link">Impressum</a>
          `,
        },
        preferencesModal: {
          title: 'Cookie-Einstellungen',
          acceptAllBtn: 'Alle akzeptieren',
          acceptNecessaryBtn: 'Alle ablehnen',
          savePreferencesBtn: 'Einstellungen speichern',
          closeIconLabel: 'Schließen',
          sections: [
            {
              title: 'Cookie-Nutzung',
              description:
                'Ich verwende Cookies, um die grundlegenden Funktionen der Website sicherzustellen und Ihr Online-Erlebnis zu verbessern. Sie können für jede Kategorie jederzeit ein- oder ausschalten. Weitere Details zu Cookies und anderen sensiblen Daten finden Sie in der vollständigen <a href="#" class="cc__link">Datenschutzerklärung</a>.',
            },
            {
              title: 'Unbedingt erforderliche Cookies',
              description: 'Beschreibung',
              linkedCategory: 'necessary',
            },
            {
              title: 'Leistungs- und Analyse-Cookies',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Dienst',
                  description: 'Beschreibung',
                  expiration: 'Ablaufdatum',
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie gesetzt von <a href="#das">Google Analytics</a>.',
                    expiration: 'Läuft nach 12 Tagen ab',
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      'Cookie gesetzt von <a href="#das">Google Analytics</a>',
                    expiration: 'Sitzung',
                  },
                ],
              },
            },
            {
              title: 'Weitere Informationen',
              description:
                'Für Fragen zu meiner Cookie-Richtlinie und Ihren Wahlmöglichkeiten <a class="cc__link" href="#yourdomain.com">kontaktieren Sie mich</a> bitte.',
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;
