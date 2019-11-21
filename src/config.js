const config = {
  meta: {
    author: 'Maxime Fabas',
    title: 'Libé apps template',
    url: '',
    description: '',
    image: '',
    xiti_id: 'test',
    tweet: 'Some tweet text',
    konami: 'https://github.com/libe-max'
  },
  tracking: {
    active: false,
    format: 'libe-apps-template',
    article: 'libe-apps-template'
  },
  show_header: true,
  statics_url: process.env.NODE_ENV === 'production'
    ? 'https://www.liberation.fr/apps/static'
    : 'http://localhost:3003',
  api_url: process.env.NODE_ENV === 'production'
    ? 'https://libe-labo-2.site/api'
    : 'http://localhost:3004/api',
  stylesheet: 'libe-apps-template.css', // The name of the css file hosted at ${statics_url}/styles/apps/
  spreadsheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPOqf8JGmbxsd3C_qIWCSbm-vZ-WWK9yF_Y0kUz_SY5-yDZ2PIcKQl9IPgJPeIW_ZYe5vyzWEVv_tH/pub?gid=1040424689&single=true&output=tsv' // The spreadsheet providing data to the app
}

export default config
