const themes = {
  france: [
    'France',
    'france',
    'Outre',
    'patrie',
    'pays',
    'français',
    'métropole',
    'peuple',
    'nation',
    'Nation',
    'citoyen',
    'Paris',
    'territoire'
  ],
  europe: [
    'Europe',
    'Union',
    'continent',
    'euro'
  ],
  travail: [
    'travail',
    'chômage',
    'emploi',
    'retraite',
    'salarié'
  ],
  institutions: [
    'institution',
    'république',
    'gouvernement',
    'Gouvernement',
    'etat',
    'état',
    'ministre',
    'démocratie',
    'droit',
    'Parlement',
    'loi',
    'justice',
    'politique'
  ],
  économie: [
    'économie',
    'economie',
    'crise',
    'effort',
    'activité',
    'compétitivité',
    'croissance',
    'dépense',
    'développement',
    'dynamisme',
    'entreprise',
    'mondialisation',
    'moyen',
    'richesse',
    'marché',
    'inflation',
    'investissement',
    'prix',
    'impôt',
    'achat'
  ],
  réforme: [
    'réforme',
    'changement',
    'batailler',
    'enjeu',
    'nouveau',
    'objectif',
    'progrès',
    'projet',
    'priorité',
    'résultat',
    'urgence',
    'volonté',
    'avenir',
    'action',
    'réformer',
    'élan',
    'étape',
    'ambition',
    'mesure',
    'initiative',
    'plan',
    'défi',
    'espoir',
    'entreprendre',
    'espérance',
    'décision',
    'détermination',
    'oeuvrer',
    'engagement'
  ],
  international: [
    'conflit',
    'étranger',
    'Etats-Unis',
    'guerre',
    'Nations',
    'pays',
    'puissance',
    'paix',
    'monder',
    'Amérique'
  ],
  société: [
    'solidarité',
    'famille',
    'enfant',
    'respect',
    'histoire',
    'valeur',
    'liberte',
    'liberté',
    'egalité',
    'fraternite',
    'fraternité',
    'dialoguer',
    'partenaire',
    'cohésion',
    'unite',
    'unité',
    'fraternité',
    'communauté',
    'société',
    'homme',
    'femme',
    'tolérance',
    'ensemble'
  ],
  crise: [
    'crise',
    'chômage',
    'difficulté',
    'épreuve',
    'lutter',
    'protection',
    'batailler',
    'division',
    'colère',
    'probleme',
    'problème',
    'péril',
    'souci',
    'inquiétude',
    'injustice',
    'violence',
    'victime',
    'souffrance',
    'exclusion',
    'solitude',
    'malade',
    'drame'
  ],
  sécurité: [
    'sécurité',
    'terrorisme',
    'soldat',
    'frontière'
  ],
  éducation: [
    'école',
    'éducation',
    'jeune',
    'formation',
    'université',
    'éducation'
  ],
  écologie: [
    'planète',
    'environnement'
  ]
}

// state.data_sheet.forEach(e => {
//     e.text_newlines = e.text_newlines
//         .replace(/\\n/g, "\n")
//         .replace(/\n- /g, "\n")
//         .replace(/[.!?\n]/g, match => `${match}[SPLIT]`)
//     let tokens = e.text_newlines.split("[SPLIT]").filter(e => e && !e.match(/^[.!?\n]/))
//     tokens.forEach((sentence, index) => {
//         sentences.push({
//             date: e.date,
//             datetime: e.datetime,
//             title: e.titre,
//             president: e.president,
//             sentence: sentence,
//             sentenceIndex: index,
//             speechLength: tokens.length
//         })
//     })
// })

sentences = state.data_sheet.map(e => {
  return {
    themes: '',
    ...e
  }
})
sentences.map(e => {
  for (const theme of Object.keys(themes)) {
    for (const keyword of themes[theme]) {
      if (e.keywords.includes(keyword)) {
        e.themes += theme + ','
        break
      }
    }
  }
  return e
})

{ /*
<table>
  <tbody>
      {sentences.map(e => <tr>
          <td>{e.title}</td>
          <td>{e.president}</td>
          <td>{e.date}</td>
          <td>{e.sentence}</td>
          <td>{e.themes}</td>
          <td>{e.sentenceIndex}</td>
          <td>{e.speechLength}</td>
      </tr>)}
  </tbody>
  </table>
  */ }

console.log(sentences)
