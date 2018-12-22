<i18n>
  ar:
    message:
      term: "المصطلح"
      dictionary: "القاموس"
      meaning:
        header: "المعاني"
        add: "أضف المعاني"
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
      clear: "إلغاء"
      submit: "التأكيد"
</i18n>
<template>
  <v-form ref="form" v-model="valid">
    <v-snackbar
      v-model="success_snackbar"
      color="success"
      :timeout="2000"
      buttom
      absolute
      left
    >
      {{ $t('message.example.created') }}
    </v-snackbar>
    <v-snackbar
      color="error"
      :timeout="2000"
      absolute
      v-model="failure_snackbar"
      buttom
      left
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
            :counter="10"
            :label="$t('message.term')"
            :rules="requiredRules"
            :items="terms"
            required
            :is="term_tag"
          ></component>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="!inserting_example">
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
            :rules="requiredRules"
            required
          >
          </v-autocomplete>
        </v-flex>
        <v-flex  xs10 md5 pa-2>
          <v-text-field
            :disabled="inserting_meaning"
            v-model="meaning.text"
            :label="$t('message.meaning.text')"
            :rules="requiredRules"
            required
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
              item-text="name"
              item-value="id"
              :rules="requiredRules"
              @input="filterDocuments(index)"
              required
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs10 md4 pa-2>
            <v-autocomplete
              :disabled="inserting_example"
              v-model="example.category"
              :label="$t('message.example.category')"
              :items="example.categories"
              :rules="requiredRules"
              @input="filterDocuments(index)"
              required
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs10 md4 pa-2>
            <v-autocomplete
              :disabled="inserting_example"
              v-model="example.document"
              :label="$t('message.example.document')"
              :items="example.documents"
              :rules="requiredRules"
              @input="getSentences(index)"
              item-value="id"
              item-text="name"
              required
            >
            </v-autocomplete>
          </v-flex>
          <v-flex  xs10 md8 pa-2>
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
          </v-flex>
          <v-flex pa-2>
            <v-checkbox :label="$t('message.example.confirmed')">
              {{ $t('message.example.confirmed') }}
            </v-checkbox>
          </v-flex>
          <v-flex v-if="!inserting_example" pa-2>
            <v-btn icon>
              <v-icon meduim @click="deleteExample(index)">delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex v-if="!inserting_example" pa-2>
            <v-btn icon v-show="index === examples.length - 1">
              <v-icon meduim @click="addExample">add</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </template>
    </v-container>
    <v-btn
      :disabled="!valid"
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
    meaning_to_insert: Object,
    page: Number
  },
  data: () => ({
    valid: true,
    requiredRules: [v => !!v || 'This field is required'],
    term: '',
    dictionary: '',
    meanings: [],
    examples: [],
    terms: [],
    success_snackbar: false,
    failure_snackbar: false,
    term_tag: 'v-text-field'
  }),
  computed: {
    inserting_example: function () {
      return typeof this.example_to_insert !== 'undefined'
    },
    inserting_term: function () {
      return typeof this.term_to_insert !== 'undefined'
    },
    inserting_meaning: function () {
      return typeof this.meaning_to_insert !== 'undefined'
    },
    ...mapState(['postags', 'dictionaries', 'periods', 'categories'])
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        const examples = this.examples.map(example => ({
          'document': example.document,
          'sentence': example.sentence.sentence,
          'confirmed': example.confirmed,
          'position': example.sentence.position,
          'word_position': example.sentence.sentence.indexOf(this.term)
        }))
        this.meanings[0]['appears_set'] = examples
        const self = this
        $backend.$createEntry(this.term, this.meanings, examples)
          .then(function (response) {
            console.log(response)
            self.success_snackbar = true
          })
          .catch(function (error) {
            console.error(error)
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
        sentence: '',
        periods: this.periods,
        period: '',
        categories: this.categories,
        category: '',
        confirmed: false
      })
    },
    async filterDocuments (index) {
      const example = this.examples[index]
      const periods = []
      if (example['period']) periods.push(example['period'])
      const categories = []
      if (example['category']) categories.push(example['category'])
      const docs = await $backend.$fetchDocuments(periods, categories, '')
      example['documents'] = docs.results
    },
    async getSentences (index) {
      const example = this.examples[index]
      const res = await $backend.$getSentences(example['document'])
      example['sents'] = res.results.map(o => {
        o.sentence = o.sentence.join(' ')
        return o
      })
    },
    log (example) {
      console.log(example.sentence)
    }
  },
  mounted () {
    console.log('mounted !')
    if (this.inserting_example) {
      console.log('received example_to_insert: ', this.example_to_insert)
      this.examples.push(this.example_to_insert)
      this.terms = this.example_to_insert.sentence.split(' ')
      this.term_tag = 'v-autocomplete'
    }
    if (this.inserting_term) {
      console.log('received term_to_insert', this.term_to_insert)
      this.term = this.term_to_insert
    }
    if (this.inserting_meaning) {
      console.log('received meaning_to_insert', this.meaning_to_insert)
      this.meanings = [ this.meaning_to_insert ]
      this.meaning = this.meaning_to_insert
    }
  }
}
</script>

<style scoped>

</style>
