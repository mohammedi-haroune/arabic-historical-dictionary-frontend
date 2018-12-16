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
$backend.$getSentences = (id, page = 1) => $backend.get('sentences/', { params: { id, page } })

$backend.$createEntry = (term, meanings, examples) =>
  $backend.post('entries/', {
    term: term,
    dictionary: 1,
    meaning_set: meanings,
    appears_set: examples
  })

export default $backend
