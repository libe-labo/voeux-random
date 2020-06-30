const config = {
  meta: {
    author: '',
    title: 'Libération.fr - Générateur de vœux présidentiels',
    url: 'https://www.liberation.fr/apps/2019/12/voeux-presidentiels',
    description: 'https://www.liberation.fr/apps/2019/12/voeux-presidentiels/social.jpg',
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
  spreadsheet: './data.tsv' // The spreadsheet providing data to the app
}

module.exports = config
