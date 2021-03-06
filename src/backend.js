import axios from 'axios'

let baseUrl = process.env.VUE_APP_API_URL
let timeout = process.env.VUE_APP_API_CALL_TIMEOUT
console.log('VUE_APP_API_URL', baseUrl)
console.log('VUE_APP_API_CALL_TIMEOUT', timeout)

let $backend = axios.create({
  // baseURL: 'http://104.197.159.71/api/',
  baseURL: baseUrl,
  timeout: timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFTOKEN': document.cookie.split(';')[0].split('=')[1]
  },
  withCredentials: true
})

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// Response Interceptor to handle and log errors
$backend.interceptors.response.use(
  response => response.data, function (error) {
    console.error(error)
    return Promise.reject(error)
  })

$backend.$fetchDocuments = (periods, categories, query, page) =>
  $backend.get('documents/', { params: { periods, categories, query, page } })

$backend.$getDictionary = (id) => $backend.get('dictionaries/' + id)

$backend.$getEntrySet = (query, page) => $backend.get('entries/', { params: { query, page } })

$backend.$getPeriods = () => $backend.get('periods/')

$backend.$getCategories = () => $backend.get('categories/')

$backend.$getDicts = () => $backend.get('dictionaries/', { params: { entry_set: true } })

$backend.$getPostags = () => $backend.get('postags/')

$backend.$getDocument = (id) => $backend.get('documents/' + id, { params: { raw: true } })
$backend.$getSentences = (params) => $backend.get('search/sentences', { params })
$backend.$getDocumentSentences = (id, page = 1) => $backend.get('sentences/', { params: { id, page } })

$backend.$fetchAppears = (id) => $backend.get('meaning_appears/' + id)
$backend.$deleteAppears = (id) => $backend.delete('appears/' + id + '/')
$backend.$putAppears = (id, appears) => $backend.put('appears/' + id + '/', appears)
$backend.$patchAppears = (id) => $backend.delete('meaning_appears/' + id + '/')

$backend.$fetchWordAppears = (params) => $backend.get('meaning_appears/', { params })

$backend.$getStatisticsById = (word_id) => $backend.get('statistics/word?id=' + word_id, { params: { raw: true } })
$backend.$getStatisticsByTerm = (word) => $backend.get('statistics/word?t=' + word, { params: { raw: true } })
$backend.$getStatisticsByFileId = (fileid) => $backend.get('statistics/doc?id=' + fileid)
$backend.$getStats = () => $backend.get('statistics?refresh=1');
$backend.$getStatisticsSentsByWords = (words) => {

  let s = "";
  for (let i = 0; i < words.length; i++) {
    console.log("the word is ", words[i])
    s += words[i] + ","
  }
  s = s.slice(0, s.length - 1);
  return $backend.get('statistics/sent?s=' + s, { params: { raw: true } });
}



$backend.$createEntry = (term, meanings, id) => {
  if (typeof id === 'undefined') {
    return $backend.post('entries/', {
      term: term,
      meaning_set: meanings
    })
  } else {
    console.log('seding post requesst with id', id)
    return $backend.post('entries/', {
      id: id,
      term: term,
      meaning_set: meanings
    })
  }
}

$backend.$auto_mode = (id) => $backend.get('fill/historicDict', { params: { id: id, batch: 10 } })

$backend.$getPeriodsAndCategories = (params) => $backend.get('search/appears', { params })

export default $backend
