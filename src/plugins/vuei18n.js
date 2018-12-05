import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// Ready translated locale messages
const messages = {
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        rowsPerPageAll: 'All',
        pageText: '{0}-{1} of {2}',
        noResultsText: 'No matching records found',
        nextPage: 'Next page',
        prevPage: 'Previous page'
      },
      dataTable: {
        rowsPerPageText: 'Rows per page:'
      },
      noDataText: 'No data available'
    }
  },
  ar: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'مواد لكل صفحة:',
        rowsPerPageAll: 'الكل',
        pageText: '{0} - {1} من {2}',
        noResultsText: 'لم يتم العثور على سجلات متطابقة',
        nextPage: 'الصفحة التالية',
        prevPage: 'الصفحة السابقة'
      },
      dataTable: {
        rowsPerPageText: 'الصفوف في كل صفحة:'
      },
      noDataText: 'لا تتوافر بيانات'
    }
  }
}

// Create VueI18n instance with options
export default new VueI18n({
  locale: 'ar',
  fallbackLocale: 'ar',
  messages
})
