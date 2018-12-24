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
        select: "اختر بعض الجمل"
        selected: "الجمل المختارة"
      clear: "إلغاء"
      submit: "التأكيد"
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
          ></component>
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
              :items="periods"
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
              :items="categories"
              :rules="requiredRules"
              @input="filterDocuments(index)"
              required
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
              <v-btn icon slot="activator" :disabled="example.sents.length === 0">
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
                    required
                    return-object
                  ></v-checkbox>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>
          <v-flex xs1 v-if="!inserting_example">
            <v-btn icon>
              <v-icon meduim @click="deleteExample(index)">delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs1 v-if="!inserting_example">
            <v-btn icon v-show="index === examples.length - 1">
              <v-icon meduim @click="addExample">add</v-icon>
            </v-btn>
          </v-flex>
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
    id_to_insert: Number,
    meaning_to_insert: Object
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
    ...mapState(['postags', 'dictionaries', 'periods', 'categories'])
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        /*
        const examples = this.examples.map(example => ({
          'document': example.document,
          'sentence': example.sentence.sentence,
          'confirmed': example.confirmed,
          'position': example.sentence.position,
          'word_position': example.sentence.sentence.indexOf(this.term)
        }))
        */

        const examples = this.examples.flatMap(example => {
          console.log('example', example)
          return example.sentences.map(index => example.sents[index]).map(sentence => {
            console.log('sentence', sentence)
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
      console.log('adding example yaw !')
      this.examples.push({
        documents: [],
        document: '',
        sents: [],
        sentences: [],
        sentence: '',
        // periods: this.periods,
        period: '',
        // categories: this.categories,
        category: '',
        confirmed: true
      })
    },
    async filterDocuments (index) {
      const example = this.examples[index]
      const periods = []
      if (example['period']) periods.push(example['period'])
      const categories = []
      if (example['category']) categories.push(example['category'])
      const docs = await $backend.$fetchDocuments(periods, categories, '')
      example.documents = docs.results
      this.getSentences(index)
    },
    async getSentences (index) {
      const example = this.examples[index]
      const documents = example.documents
      example.sents.splice(0, example.sents.length)
      example.sentences.splice(0, example.sentences.length)
      documents.forEach(doc => {
        $backend.$getSentences(doc.id)
          .then(res => {
            res.results.map(o => {
              o.sentence = o.sentence.join(' ').substring(0, 60)
              return o
            }).forEach(o => example.sents.push(o))
          })
      })
    },
    log (example) {
      console.log(example.sentence)
    },
    open_dialog (example) {
      this.dialog = true
    }
  },
  mounted () {
    console.log('mounted !')
    if (this.inserting_example) {
      console.log('received example_to_insert: ', this.example_to_insert)
      console.log('received example_to_insert.sentences[0]: ', this.example_to_insert.sents[0].sentence.split(' '))
      this.examples.push(this.example_to_insert)
      this.terms = this.example_to_insert.sents[0].sentence.split(' ')
      console.log('this.terms', this.terms)
      this.term_tag = 'v-autocomplete'
    } else {
      // ensure that at least one example is added
      this.addExample()
    }
    if (this.inserting_term) {
      console.log('received term_to_insert', this.term_to_insert)
      this.term = this.term_to_insert
    }
    if (this.inserting_meaning) {
      console.log('received meaning_to_insert', this.meaning_to_insert)
      this.meanings = [ this.meaning_to_insert ]
      this.meaning = this.meaning_to_insert
    } else {
      // ensure that at least one meaning is added
      this.addMeaning()
    }
    if (this.inserting_id) {
      console.log('recevied id_to_insert', this.id_to_insert)
    }
  }
}
</script>

<style scoped>

</style>
