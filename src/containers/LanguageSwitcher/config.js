import { language } from 'settings';

import englishLang from 'images/flag/uk.svg';
import frenchLang from 'images/flag/france.svg';
// import chineseLang from 'images/flag/china.svg';
// import spanishLang from 'images/flag/spain.svg';
// import italianLang from 'images/flag/italy.svg';

const config = {
  defaultLanguage: language,
  options: [
    {
      languageId: 'english',
      locale: 'en_ca',
      text: 'English',
      icon: englishLang,
    },
    {
      languageId: 'french',
      locale: 'fr_ca',
      text: 'French',
      icon: frenchLang,
    },
    // {
    //   languageId: 'spanish',
    //   locale: 'es',
    //   text: 'Spanish',
    //   icon: spanishLang,
    // }
    // {
    //   languageId: 'chinese',
    //   locale: 'zh',
    //   text: 'Chinese',
    //   icon: chineseLang,
    // },
    // {
    //   languageId: 'italian',
    //   locale: 'it',
    //   text: 'Italian',
    //   icon: italianLang,
    // },
  ],
};

export function getCurrentLanguage(lang) {
  let selecetedLanguage = config.options[0];
  config.options.forEach(language => {
    if (language.languageId === lang) {
      selecetedLanguage = language;
    }
  });
  return selecetedLanguage;
}
export default config;
