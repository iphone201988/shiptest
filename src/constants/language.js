
export const locale_map = {
  'en_ca': {
    languageId: 'english',
    locale: 'en_ca',
    intl_key: "language.english.canada",
    text: 'English - Canada',
  },
  'fr_ca': {
    languageId: 'french',
    locale: 'fr_ca',
    intl_key: "language.french.canada",
    text: 'French - Canada',
  },
}

export const change_locale_path = (full_path, locale) => {
  try{
    return `/${locale}/${full_path.slice(7)}`
  }catch (e) {
    return full_path
  }

}