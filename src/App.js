import React, { Component } from 'react'
import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import LibeLaboLogo from 'libe-components/lib/blocks/LibeLaboLogo'
import ArticleMeta from 'libe-components/lib/blocks/ArticleMeta'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import parseTsv from 'libe-utils/parse-tsv'

import styles from './app.module.css'

export default class App extends Component {
  /* * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'lblb-some-app'
    this.state = {
      loading_sheet: true,
      error_sheet: null,
      data_sheet: []
    }
    this.setKonami = this.setKonami.bind(this)
    this.fetchSheet = this.fetchSheet.bind(this)
    this.fetchCredentials = this.fetchCredentials.bind(this)
    this.handleGeneration = this.handleGeneration.bind(this)
    this.getParagraph = this.getParagraph.bind(this)
    this.getRandomSentence = this.getRandomSentence.bind(this)
    this.renderSentence = this.renderSentence.bind(this)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.setKonami()
    this.fetchCredentials()
    if (this.props.spreadsheet) return this.fetchSheet()
    return this.setState({ loading_sheet: false })
  }

  setKonami () {
    const konami = '38,38,40,40,37,39,37,39,66,65'
    const keys = []
    const listener = (e) => {
    	keys.push(e.keyCode)
    	if (keys.join(',').includes(konami)) {
    		document.removeEventListener('keydown', listener)
        console.log(this.props.meta.konami)
    		window.location.href = this.props.meta.konami
    	}
    }
    document.addEventListener('keydown', listener)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH CREDENTIALS
   *
   * * * * * * * * * * * * * * * * */
  async fetchCredentials () {
    const { api_url } = this.props
    const { format, article } = this.props.tracking
    const api = `${api_url}/${format}/${article}/load`
    try {
      const reach = await window.fetch(api, { method: 'POST' })
      const response = await reach.json()
      const { lblb_tracking, lblb_posting } = response._credentials
      if (!window.LBLB_GLOBAL) window.LBLB_GLOBAL = {}
      window.LBLB_GLOBAL.lblb_tracking = lblb_tracking
      window.LBLB_GLOBAL.lblb_posting = lblb_posting
      return { lblb_tracking, lblb_posting }
    } catch (error) {
      console.error('Unable to fetch credentials:')
      console.error(error)
      return Error(error)
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH SHEET
   *
   * * * * * * * * * * * * * * * * */
  async fetchSheet () {
    this.setState({ loading_sheet: true, error_sheet: null })
    const sheet = this.props.spreadsheet
    try {
      const reach = await window.fetch(this.props.spreadsheet)
      if (!reach.ok) throw reach
      const data = await reach.text()
      const parsedData = parseTsv(data, [6]) // Parse sheet here
      const sentences = parsedData[0].filter(e => e.themes !== '' && e.sentence !== '')
      this.setState({
        error_sheet: null,
        data_sheet: sentences,
        sentences: sentences.map((e, i) => {
          return {
            id: i,
            ...e
          }
        }),
        // startSentences: sentences.filter(e => +e.sentenceIndex === 0),
        // endSentences: sentences.filter(e => +e.sentenceIndex === +e.speechLength - 1),
        selectedSentences: [],
        loading_sheet: false
      })
      return data
    } catch (error) {
      if (error.status) {
        const text = `${error.status} error while fetching : ${sheet}`
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(text, error)
        return Error(text)
      } else {
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(error)
        return Error(error)
      }
    }
  }

  handleGeneration () {
    this.setState({ selectedSentences: [] })
    const paragraphs = document.querySelectorAll(`.${styles.speech} p`)
    wiggle(0, 20, 20,
      () => {
        paragraphs.forEach(p => {
          p.style.marginLeft = `${Math.random() * 20}px`
          p.style.transform = `translateY(${(Math.random() * 20) - 10}px)`
          p.style.filter = 'blur(5px)'
        })
      },
      () => {
        paragraphs.forEach(p => {
          p.style.marginLeft = '0px'
          p.style.transform = ''
          p.style.filter = ''
        })
      }
    )
    this.forceUpdate()
  }

  getRandomSentence (size, themes) {
    let length
    switch (size) {
      case 'short':
        length = 100
        break
      case 'medium':
        length = 250
        break
      default:
        length = 500
    }
    const selection = this.state.sentences.filter(e => {
      for (const theme of themes) {
        if (e.themes.includes(theme) && e.sentence.length < length) {
          return true
        }
      }
      return false
    })
    let alea = Math.floor(Math.random() * selection.length)
    while (this.state.selectedSentences.includes(selection[alea].id)) { alea = Math.floor(Math.random() * selection.length) }
    this.state.selectedSentences.push(selection[alea].id)
    return (selection[alea])
  }

  getParagraph (length, themes) {
    const paragraph = []
    for (let i = 0; i < length; i++) {
      const size = Math.random() > 0.66 ? (Math.random() > 0.5 ? 'short' : 'medium') : 'long'
      const sentence = this.getRandomSentence(size, themes)
      themes = Math.random() < 0.8 ? sentence.themes : ['bullshit']
      console.log(themes)
      paragraph.push(sentence)
    }
    return paragraph
  }

  renderSentence (e) {
    return (
      <span className={styles.sentence} key={e.sentence}>
        <span>{e.sentence + ' '}</span>
        <span className={styles.tooltip} key={`${e.sentence} tooltip`}>{`${e.president}  ${e.date.substring(0, 4)}`}</span>
      </span>
    )
  }

  /* * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * */
  render () {
    const { c, state, props } = this

    /* Assign classes */
    const classes = [c]
    if (state.loading_sheet) classes.push(`${c}_loading`)
    if (state.error_sheet) classes.push(`${c}_error`)

    /* Load & errors */
    if (state.loading_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-loader'><Loader /></div></div>
    if (state.error_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-error'><LoadingError /></div></div>

    console.log(state.sentences)

    /* Display component */
    return (
      <div className={classes.join(' ')}>
        <div className='lblb-default-apps-footer'>
          <BlockTitle>Essayez notre générateur de vœux présidentiels !</BlockTitle>
          <button className={styles.generateButton} onClick={this.handleGeneration}>
            <Paragraph>Générer</Paragraph>
          </button>
          <div className={styles.speech}>
            <Paragraph small>
              {this.getParagraph(1, ['first'])
                .map(this.renderSentence)}
              {this.getParagraph(1, ['intro'])
                .map(this.renderSentence)}
            </Paragraph>
            <Paragraph small>
              {this.getParagraph(4, ['crise'])
                .map(this.renderSentence)}
            </Paragraph>
            <Paragraph small>
              {this.getParagraph(4, ['réforme', 'économie'])
                .map(this.renderSentence)}
            </Paragraph>
            <Paragraph small>
              {this.getParagraph(4, ['international', 'éducation', 'écologie'])
                .map(this.renderSentence)}
            </Paragraph>
            <Paragraph small>
              {this.getParagraph(1, ['last'])
                .map(this.renderSentence)}
            </Paragraph>
          </div>
          <ShareArticle short iconsOnly tweet={props.meta.tweet} url={props.meta.url} />
          <ArticleMeta
            publishedOn='02/09/2019 17:13' updatedOn='03/09/2019 10:36' authors={[
              { name: 'Jean-Sol Partre', role: '', link: 'www.liberation.fr' },
              { name: 'Maxime Fabas', role: 'Production', link: 'lol.com' },
              { name: 'Savinien de Rivet', role: 'Production', link: 'lol.com' },
              { name: 'Tom Février', role: 'Production', link: 'lol.com' }
            ]}
          />
          <LibeLaboLogo target='blank' />
        </div>
      </div>
    )
  }
}

function wiggle (step = 0, limit = 1, delay = 0, action = () => {}, callback = () => {}) {
  action()
  return (step <= limit)
    ? setTimeout(e => wiggle(step + 1, limit, delay, action, callback), delay)
    : callback()
}
