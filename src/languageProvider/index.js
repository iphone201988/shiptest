import EnCAlang from './entries/en-US';
import FrCAlang from './entries/fr_FR';
// import Zhlang from './entries/zh-Hans-CN';
// import Salang from './entries/ar_SA';
// import Itlang from './entries/it_IT';
// import Eslang from './entries/es_ES';

import { addLocaleData } from 'react-intl';

const AppLocale = {
  en_ca: EnCAlang,
  fr_ca: FrCAlang
  // zh: Zhlang,
  // sa: Salang,
  // it: Itlang,
  // es: Eslang,

};

addLocaleData(AppLocale.en_ca.data);
addLocaleData(AppLocale.fr_ca.data);
// addLocaleData(AppLocale.zh.data);
// addLocaleData(AppLocale.sa.data);
// addLocaleData(AppLocale.it.data);
// addLocaleData(AppLocale.es.data);


export default AppLocale;
