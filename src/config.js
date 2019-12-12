const config = {
  meta: {
    author: '',
    title: 'Libération.fr - Générateur de vœux présidentiels',
    url: 'https://www.liberation.fr/apps/2019/12/voeux-presidentiels',
    description: '',
    image: '',
    xiti_id: 'voeux-presidentiels',
    tweet: 'Voici mon discours de vœux présidentiels. Générez le votre sur @libe !'
  },
  tracking: {
    active: false,
    format: 'voeux-presidentiels',
    article: 'voeux-presidentiels'
  },
  show_header: false,
  statics_url: process.env.NODE_ENV === 'production'
    ? 'https://www.liberation.fr/apps/static'
    : 'http://localhost:3003',
  api_url: process.env.NODE_ENV === 'production'
    ? 'https://libe-labo-2.site/api'
    : 'http://localhost:3004/api',
  stylesheet: 'voeux.css',
  spreadsheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPOqf8JGmbxsd3C_qIWCSbm-vZ-WWK9yF_Y0kUz_SY5-yDZ2PIcKQl9IPgJPeIW_ZYe5vyzWEVv_tH/pub?gid=155317366&single=true&output=tsv' // The spreadsheet providing data to the app
}

module.exports = config
