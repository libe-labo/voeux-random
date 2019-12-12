import React, { Component } from 'react'
import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import ArticleMeta from 'libe-components/lib/blocks/ArticleMeta'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import JSXInterpreter from 'libe-components/lib/logic/JSXInterpreter'
import parseTsv from 'libe-utils/parse-tsv'

export default class App extends Component {
  /* * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'voeux-presidents'
    this.state = {
      loading_sheet: true,
      error_sheet: null,
      data_sheet: [],
      selectedSentences: []
    }
    this.fetchSheet = this.fetchSheet.bind(this)
    this.fetchCredentials = this.fetchCredentials.bind(this)
    this.wiggle = this.wiggle.bind(this)
    this.handleGeneration = this.handleGeneration.bind(this)
    this.getParagraph = this.getParagraph.bind(this)
    this.getRandomSentence = this.getRandomSentence.bind(this)
    this.renderSentence = this.renderSentence.bind(this)
    this.getParams = this.getParams.bind(this)
    this.generateShareLink = this.generateShareLink.bind(this)
  }

  /* * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.fetchCredentials()
    if (this.props.spreadsheet) return this.fetchSheet()
    return this.setState({ loading_sheet: false })
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
      const parsedData = parseTsv(data, [5]) // Parse sheet here
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
        selectedSentences: this.getParams(),
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

  wiggle (step = 0, limit = 1, delay = 0, action = () => {}, callback = () => {}) {
    action()
    return (step <= limit)
      ? setTimeout(e => this.wiggle(step + 1, limit, delay, action, callback), delay)
      : callback()
  }

  handleGeneration () {
    const paragraphs = document.querySelectorAll('.speech .lblb-paragraph')
    this.wiggle(0, 20, 20,
      () => {
        paragraphs.forEach(p => {
          p.style.marginLeft = `${Math.random()}rem`
          p.style.transform = `translateY(${(Math.random()) - 0.5}rem)`
          p.style.filter = 'blur(2px)'
        })
      },
      () => {
        paragraphs.forEach(p => {
          p.style.marginLeft = 0
          p.style.transform = ''
          p.style.filter = ''
        })
        this.setState({ selectedSentences: [] })
        this.forceUpdate()
      }
    )
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
    while (this.state.selectedSentences.includes(selection[alea].id)) {
      alea = Math.floor(Math.random() * selection.length)
    }
    this.state.selectedSentences.push(selection[alea].id)
    return (selection[alea])
  }

  getParagraph (length, themes) {
    const paragraph = []
    for (let i = 0; i < length; i++) {
      const size = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'short' : 'medium') : 'long'
      const sentence = this.getRandomSentence(size, themes)
      themes = Math.random() < 0.8 ? sentence.themes : ['bullshit']
      paragraph.push(sentence)
    }
    return paragraph
  }

  renderSentence (e) {
    return (
      <span className='sentence' key={e.sentence}>
        <span>{e.sentence + ' '}</span>
        <span className='sentence__tooltip' key={`${e.sentence} tooltip`}>
          <a
            href={e.url}
            target='_blank'
            rel='noopener noreferrer'>
            <JSXInterpreter
              content={`${e.president} ${e.date.substring(0, 4)}`.replace(/ /g, '&nbsp;')} />
          </a>
        </span>
      </span>
    )
  }

  getParams () {
    const res = new window.URL(window.location.href).searchParams.get('res')
    return res ? window.atob(window.decodeURI(res)).split(';').map(e => parseInt(e, 36)) : []
  }

  generateShareLink () {
    const data = this.state.selectedSentences.map(e => e.toString(36)).join(';')
    return `${this.props.meta.url}?res=${window.encodeURI(window.btoa(data))}`
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

    /* Display component */
    return (
      <div className={classes.join(' ')}>
        <div className='lblb-default-apps-footer'>
          <BlockTitle>Essayez notre générateur de vœux présidentiels&nbsp;!</BlockTitle>
          <div className='container'>
            <div className='image'>
              <img src='./image.gif' />
            </div>
            {state.selectedSentences.length > 0 && (
              <div className='speech'>
                <button className='generateButton' onClick={this.handleGeneration}>
                  <Paragraph>Générer</Paragraph>
                  <img src='./random.png' />
                </button>
                <Paragraph small>
                  {state.selectedSentences.slice(0, 2)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
                <Paragraph small>
                  {state.selectedSentences.slice(2, 6)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
                <Paragraph small>
                  {state.selectedSentences.slice(6, 10)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
                <Paragraph small>
                  {state.selectedSentences.slice(10, 14)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
                <Paragraph small>
                  {state.selectedSentences.slice(14, 17)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
                <Paragraph small>
                  {state.selectedSentences.slice(17)
                    .map(index => state.sentences[index])
                    .map(this.renderSentence)}
                </Paragraph>
              </div>
            )}
            {state.selectedSentences.length === 0 && (<div className='speech'>
              <button className='generateButton' onClick={this.handleGeneration}>
                <Paragraph>Générer</Paragraph>
                <img src='/random.png' />
              </button>
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
                {this.getParagraph(3, ['france'])
                  .map(this.renderSentence)}
              </Paragraph>
              <Paragraph small>
                {this.getParagraph(1, ['last'])
                  .map(this.renderSentence)}
              </Paragraph>
            </div>)}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start'}}>
            <BlockTitle>Partagez votre discours&nbsp;!</BlockTitle>
            <br />
            <ShareArticle short iconsOnly tweet={props.meta.tweet} url={this.generateShareLink()} />
          </div>
          <div style={{alignSelf: 'flex-start'}}>
            <ArticleMeta authors={[
              { name: 'Tom Février', role: 'Production' },
              { name: 'Libé Labo', role: 'Production', link: 'https://www.liberation.fr/libe-labo-data-nouveaux-formats,100538' }
            ]} />
            </div>
        </div>
      </div>
    )
  }
}
