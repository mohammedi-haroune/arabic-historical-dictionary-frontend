<i18n>
  ar:
    message:
      term: "المصطلح"
      dictionary: "القاموس"
      meaning:
        header: "المعنى"
        add: "أضف المعنى"
        text: "النص"
        posTag: "نوع"

      example:
        header: "الأمثلة التاريخية"
        add: "أضف الأمثلة"
        sentence: "الجملة"
        document: "الوثيقة"
        period: "الفترة الزمنية"
        category: "القسم"
        confirmed: "مؤكد"
        created: "سبيل المصطلح تم إنشاؤها بنجاح"
        failure: "حدث خطأ عند إنشاء المصطلح"
        select: "اختر بعض الجمل"
        selected: "الجمل المختارة"
      clear: "إلغاء"
      submit: "التأكيد"
      no_hist_example: "لا يوجد أية أمثلة تاريخية"
</i18n>
<template>
  <v-form ref="form" v-model="valid">
    <v-snackbar
      v-model="success_snackbar"
      color="success"
      :timeout="5000"
      top
      :absolute="inserting_meaning || inserting_term || inserting_example"
      center
      closeable
    >
      {{ $t('message.example.created') }}
    </v-snackbar>
    <v-snackbar
      color="error"
      :timeout="5000"
      v-model="failure_snackbar"
      :absolute="inserting_meaning || inserting_term || inserting_example"
      top
      center
      closeable
    >
      {{ $t('message.example.failure') }}
    </v-snackbar>
    <v-container>

      <h3>{{ $t('message.term') }}</h3>
      <v-layout>
        <v-flex md5 pa-2>
          <component
            :disabled="inserting_term"
            v-model="term"
            :label="$t('message.term')"
            :rules="requiredRules"
            :items="terms"
            required
            :is="term_tag"
            @input="filterPeriodsAndCategoriesCouples()"
          ></component>
        </v-flex>
        <v-flex md5 pa-2>
          <v-alert v-if="no_hist_example" :value="no_hist_example" type="warning" outline>{{ $t('message.no_hist_example') }}</v-alert>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <h3>
        {{ $t('message.meaning.header') }}
      </h3>
      <v-flex v-if="meanings.length === 0">
        <v-btn @click="addMeaning">
          {{ $t('message.meaning.add') }}
          <v-icon meduim>add</v-icon>
        </v-btn>
      </v-flex>
      <v-layout
        v-for="(meaning, index) in meanings"
        :key="index"
        align-content-space-around
        row>
        <v-flex xs10 md5 pa-2>
          <v-autocomplete
            :disabled="inserting_meaning"
            v-model="meaning.posTag"
            :label="$t('message.meaning.posTag')"
            :items="postags"
            @input="this.submitted = false"
            clearable
          >
          </v-autocomplete>
        </v-flex>
        <v-flex  xs10 md5 pa-2>
          <v-text-field
            :disabled="inserting_meaning"
            v-model="meaning.text"
            :label="$t('message.meaning.text')"
            :rules="requiredRules"
            @input="this.submitted = false"
            required
            clearable
          >
          </v-text-field>
        </v-flex>
        <!-- <v-flex pa-2 v-if="!inserting_meaning">
          <v-btn icon>
            <v-icon meduim @click="deleteMeaning(index)">delete</v-icon>
          </v-btn>
        </v-flex>
        <v-flex pa-2 v-if="!inserting_meaning">
          <v-btn icon v-show="index === meanings.length - 1">
            <v-icon meduim @click="addMeaning">add</v-icon>
          </v-btn>
        </v-flex> -->
      </v-layout>
    </v-container>
    <v-container wrap>
      <h3>
        {{ $t('message.example.header') }}
      </h3>
      <v-flex v-if="examples.length === 0">
        <v-btn @click="addExample">
          {{ $t('message.example.add') }}
          <v-icon meduim>add</v-icon>
        </v-btn>
      </v-flex>
      <template
        v-for="(example, index) in examples"
      >
        <v-layout :key="index" wrap row>
          <v-flex xs10 md4 pa-2>
            <v-autocomplete
              :disabled="inserting_example"
              v-model="example.period"
              :label="$t('message.example.period')"
              :items="example.periods"
              :loading="example.loading_periods"
              item-text="name"
              item-value="id"
              @change="getSentences(index)"
              clearable
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs10 md4 pa-2>
            <v-autocomplete
              :disabled="inserting_example"
              v-model="example.category"
              :label="$t('message.example.category')"
              :items="example.categories"
              :loading="example.loading_categories"
              @change="getSentences(index)"
              clearable
            >
            </v-autocomplete>
          </v-flex>
          <!--<v-flex xs8 md8 pa-2>
            <v-autocomplete
              :disabled="inserting_example"
              v-model="example.sentence"
              :label="$t('message.example.sentence')"
              :items="example.sents"
              :rules="requiredRules"
              item-text="sentence"
              @input="log(example)"
              return-object
              required
            >
            </v-autocomplete>
          </v-flex>-->
          <!--<v-flex xs1>
            <v-checkbox :label="$t('message.example.confirmed')">
              {{ $t('message.example.confirmed') }}
            </v-checkbox>
          </v-flex>-->
          <v-flex xs1>
            <v-dialog v-model="dialog" scrollable max-width="600px" :disabled="example.sents.length === 0">
              <v-btn icon slot="activator" :disabled="example.sents.length === 0 || example.loading_sents" :loading="example.loading_sents">
                <v-icon meduim>fa fa-list</v-icon>
              </v-btn>
              <v-card>
                <v-toolbar>
                  <v-icon>mdi-cursor-text</v-icon>
                  <v-toolbar-title>{{ $t('message.example.select') }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="dialog = false">
                    <v-icon color="red">close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text style="height: 400px;">
                  <v-checkbox
                    :key="i"
                    v-for="(sent, i) in example.sents"
                    v-model="example.sentences"
                    :label="sent.sentence"
                    :value="i"
                    return-object
                  ></v-checkbox>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>
          <!--<v-flex xs1 v-if="!inserting_example">
            <v-btn icon>
              <v-icon meduim @click="deleteExample(index)">delete</v-icon>
            </v-btn>
          </v-flex>-->
          <!--<v-flex xs1 v-if="!inserting_example">
            <v-btn icon v-show="index === examples.length - 1">
              <v-icon meduim @click="addExample">add</v-icon>
            </v-btn>
          </v-flex>-->
          <v-flex xs12 pa-2 v-if="example.sentences.length > 0">
            <v-card>
              <v-toolbar>
                <v-icon>mdi-cursor-text</v-icon>
                <v-toolbar-title>{{ $t('message.example.selected') }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <template v-for="(i, j) in example.sentences">
                      <p :key="i" class="body-2" >
                        <v-btn icon @click="example.sentences.splice(j, 1)">
                          <v-icon color="red">delete</v-icon>
                        </v-btn>
                        {{ example.sents[i].sentence }}
                      </p>
                  </template>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </template>
    </v-container>
    <v-btn
      :disabled="submitted || loading_submit"
      :loading="loading_submit"
      @click="submit"
    >
      {{ $t('message.submit') }}
    </v-btn>
    <v-btn @click="clear">{{ $t('message.clear') }}</v-btn>
  </v-form>
</template>
<script>
import { mapState } from 'vuex'
import $backend from '../backend'
export default {
  name: 'NewEntry',
  props: {
    example_to_insert: Object,
    term_to_insert: String,
    id_to_insert: Number,
    meaning_to_insert: Object
  },
  data: () => ({
    valid: true,
    loading_submit: false,
    loading: false,
    submitted: false,
    requiredRules: [v => !!v || 'This field is required'],
    term: '',
    periodToCategories: {},
    categoryToPeriods: {},
    dictionary: '',
    meanings: [],
    examples: [],
    terms: [],
    success_snackbar: false,
    failure_snackbar: false,
    dialog: false,
    selected: [],
    term_tag: 'v-text-field'
  }),
  computed: {
    inserting_example: function () {
      return typeof this.example_to_insert !== 'undefined'
    },
    inserting_term: function () {
      return typeof this.term_to_insert !== 'undefined'
    },
    inserting_id: function () {
      return typeof this.id_to_insert !== 'undefined'
    },
    inserting_meaning: function () {
      return typeof this.meaning_to_insert !== 'undefined'
    },
    no_hist_example: function () {
      return this.term && !this.loading && this.term_categories().length === 0 && this.term_periods().length === 0
    },
    ...mapState(['postags', 'dictionaries', 'periods', 'categories'])
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.loading_submit = true
        const examples = this.examples.flatMap(example => {
          return example.sentences.map(index => example.sents[index]).map(sentence => {
            return {
              'document': sentence.document,
              'sentence': sentence.sentence,
              'confirmed': true,
              'position': sentence.position,
              'word_position': sentence.sentence.indexOf(this.term)
            }
          })
        })

        this.meanings[0]['appears_set'] = examples
        const self = this
        $backend.$createEntry(this.term, this.meanings, this.id_to_insert)
          .then(function (response) {
            self.success_snackbar = true
            self.submitted = true
            self.loading_submit = false
          })
          .catch(function (error) {
            self.loading_submit = false
            self.failure_snackbar = true
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    },
    addMeaning () {
      this.meanings.push({
        text: '',
        posTag: ''
      })
    },
    deleteMeaning (index) {
      this.meanings.splice(index, 1)
    },
    deleteExample (index) {
      this.examples.splice(index, 1)
    },
    addExample () {
      this.examples.push({
        documents: [],
        document: '',
        sents: [],
        sentences: [],
        sentence: '',
        periods: this.term_periods(),
        period: '',
        categories: this.term_categories(),
        category: '',
        loading_sents: false,
        confirmed: true
      })
    },
    async getSentences (index) {
      // if period or category is changed, allow submitting the form
      this.submitted = false
      const example = this.examples[index]
      example.sents = []
      example.sentences = []
      example.loading_sents = true
      const self = this
      const params = { t: this.term }

      if (example.period !== '') {
        params.era = example.period
      }
      if (example.category !== '') {
        params.category = example.category
      }
      // update periods and categories items based on current selection
      // period is selected
      console.log('getSentences', 'period: ', example.period, 'category: ', example.category)
      // if (typeof example.period !== 'undefined' && example.period !== '') {
      if (example.period) {
        // period and category are selected
        // if (typeof example.category !== 'undefined' && example.category !== '') {
        if (example.category) {
          console.log('period and category is selected')
          example.periods = this.periodsFor(example.category)
          example.categories = this.categoriesFor(example.period)
          // period is selected, category not selected
        } else {
          console.log('period is selected, category not selected')
          example.categories = this.categoriesFor(example.period)
          example.periods = this.term_periods()
        }
        // period is not selected
      } else {
        // period not selected, category is selected
        // if (typeof example.category !== 'undefined' && example.period !== '') {
        if (example.category) {
          console.log('period not selected, category is selected')
          example.periods = this.periodsFor(example.category)
          example.categories = this.term_categories()
          // period not selected, category not selected
        } else {
          console.log('period not selected, category not selected')
          example.categories = this.term_categories()
          example.periods = this.term_periods()
        }
      }

      example.sents = await $backend.$getSentences(params)
        .then(res => {
          return res.map(function (o) {
            o.sentence = o.sentence.join(' ')
            const i = o.sentence.indexOf(self.term)
            // truncate sentence to fit in the list
            const start = i - 30 < 0 ? 0 : i - 30
            const end = i + 30 > o.sentence.length ? o.sentence.lenght : i + 30
            o.sentence = o.sentence.substring(start, end)
            return o
          })
        })
      example.loading_sents = false
    },
    async filterPeriodsAndCategoriesCouples (index) {
      // if term is changed, allow submitting the form
      this.submitted = false
      const params = { t: this.term }
      const example = this.examples[index]
      if (typeof example !== 'undefined') {
        if (example.period !== '') {
          params.era = example.period
        } else {
          example.loading_periods = true
        }
        if (example.category !== '') {
          params.category = example.category
        } else {
          example.loading_categories = true
        }
      } else {
        this.examples.forEach(example => {
          if (example.period === '') {
            example.loading_periods = true
          }
          if (example.category === '') {
            example.loading_categories = true
          }
        })
      }
      this.loading = true
      const result = await $backend.$getPeriodsAndCategories(params)
      this.loading = false
      this.periodToCategories = {}
      this.categoryToPeriods = {}
      console.log('result', result)
      result.forEach((couple) => {
        const period = couple[0]
        const category = couple[1]
        if (typeof this.periodToCategories[period] === 'undefined') {
          this.periodToCategories[period] = new Set()
        }
        this.periodToCategories[period].add(category)
        if (typeof this.categoryToPeriods[category] === 'undefined') {
          this.categoryToPeriods[category] = new Set()
        }
        this.categoryToPeriods[category].add(period)
      })
      result.eras = result.map(el => el[0])
      result.categories = result.map(el => el[1])

      // if true, means a specific example is being updated, otherwise all examples are updated
      if (typeof example !== 'undefined') {
        if (example.period === '') {
          example.periods = result.eras
          example.loading_periods = false
        }
        if (example.category === '') {
          example.categories = result.categories
          example.loading_categories = false
        }
      } else {
        this.examples.forEach(example => {
          if (example.period === '') {
            example.periods = result.eras
            example.loading_periods = false
          }
          if (example.category === '') {
            example.categories = result.categories
            example.loading_categories = false
          }
        })
      }
    },
    selected_sentences () {
      return this.examples.flatMap(e => e.sentences).length > 0
    },
    categoriesFor (period) {
      return Array.from(this.periodToCategories[period])
    },
    periodsFor (category) {
      return Array.from(this.categoryToPeriods[category])
    },
    term_categories () {
      return Object.keys(this.categoryToPeriods)
    },
    term_periods () {
      return Object.keys(this.periodToCategories)
    }
  },
  mounted () {
    if (this.inserting_example) {
      this.examples.push(this.example_to_insert)
      this.terms = this.example_to_insert.sents[0].sentence.split(' ')
      this.term_tag = 'v-autocomplete'
    } else {
      // ensure that at least one example is added
      this.addExample()
    }
    if (this.inserting_term) {
      this.term = this.term_to_insert

      // ensure periods and categories are filtered if the term is initialized when inserting a term from the dictionary
      this.filterPeriodsAndCategoriesCouples()
    }
    if (this.inserting_meaning) {
      this.meanings = [ this.meaning_to_insert ]
      this.meaning = this.meaning_to_insert
    } else {
      // ensure that at least one meaning is added
      this.addMeaning()
    }
  }
}
</script>

<style scoped>

</style>
