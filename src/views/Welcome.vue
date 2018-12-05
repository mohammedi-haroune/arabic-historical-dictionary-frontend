<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">
        <img width="350px" src="../assets/logo.png" alt="Vuetify.js" class="mb-5" />
      </div>
      <v-card>
        <v-card-title>Welcome to the IRTK (Information Retrieval ToolKit).</v-card-title>
        <v-card-text>
          <p>Welcome to the IRTK (Information Retrieval ToolKit).</p>
          <p>IRTK is a set of tools to allow users test information retrieval models and techniques easily</p>
          <p>Thank you for using IRTK and I look forward to bringing more exciting features in the future.</p>
          <div class="text-xs-right">
            <em><small>&mdash; MOHAMMEDI Haroune</small></em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" router to="/browser">Start</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
