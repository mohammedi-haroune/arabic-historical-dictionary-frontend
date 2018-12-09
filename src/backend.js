import axios from 'axios'

let $backend = axios.create({
  // baseURL: 'http://104.197.159.71/api/',
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 5000,
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

$backend.$fetchDocuments = (periods, categories, page) =>
  $backend.get('documents/', { params: { periods, categories, page } })

$backend.$getDictionary = (id) => $backend.get('dictionaries/' + id)

$backend.$getEntrySet = (page) => $backend.get('entries/', { params: { page } })

$backend.$getPeriods = () => $backend.get('periods/')

$backend.$getCategories = () => $backend.get('categories/')

$backend.$getDicts = () => $backend.get('dictionaries/', { params: { entry_set: true } })

$backend.$getPostags = () => $backend.get('postags/')

$backend.$getDocument = (id) => $backend.get('documents/' + id, { params: { raw: true } })
$backend.$getSentences = (id) => $backend.get('sentences/', { params: { id } })

$backend.$createEntry = (term, meanings, examples) =>
  $backend.post('entries/', {
    term: term,
    dictionary: 1,
    meaning_set: meanings,
    appears_set: examples
  })

export default $backend
