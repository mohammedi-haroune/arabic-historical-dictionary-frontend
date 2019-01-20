<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field
          required
          v-model="name"
          label="Corpus Name"
          solo
          clearable
          prepend-icon="create"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-textarea
          label="Corpus Description"
          solo
          clearable
          auto-grow
          rows="1"
          prepend-icon="fa fa-info"
          v-model="description"
          hint="A small description about the corpus that help users correctly use your corpus"
        ></v-textarea>
      </v-flex>
      <v-flex xs12>
        <el-upload
          ref="upload"
          name="file"
          :action="apiUrl"
          :headers="headers"
          :auto-upload="false"
          list-type="text"
          accept="text/*"
          thumbnail-mode
          :on-change="onChange"
          :on-remove="onChange"
          :before-upload="addCorpusNameData"
          :on-error="onError"
          :on-success="onSuccess"
          :data="data"
          multiple
        >
          <v-spacer></v-spacer>
          <v-btn>Select Files</v-btn>
        </el-upload>
      </v-flex>
      <v-flex xs10 offset-xs1>
        <v-btn :disabled="!valide" block raised @click="submitUpload">Upload to Server</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Upload from "element-ui";

export default {
  componenets: { Upload },
  data: function() {
    return {
      name: "",
      defaultDescription:
        "The Corpus contains texts about YOUR_TEXT_HERE collected from YOUR_TEXT_HERE.",
      description: "",
      data: {},
      selectedFiles: [],
      apiUrl: "http://localhost:8000/polls/upload_file",
      headers: {
        "Content-Disposition":
          'form-data; name="example"; filename="exceptionsup";'
      }
    };
  },
  computed: {
    valide() {
      return Boolean(this.name) && this.selectedFiles.length > 0;
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    onChange(file, filelist) {
      this.selectedFiles = filelist;
    },
    addCorpusNameData(file) {
      this.data["CORPUS_NAME"] = this.name;
      if (this.description !== this.defaultDescription) {
        this.data["CORPUS_DESCRIPTION"] = this.description;
      }
    },
    onSuccess(response, file, filelist) {},
    onError(err, file, filelist) {}
  }
};
</script>
