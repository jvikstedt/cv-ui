<template>
  <div style="width:800px">
    <v-btn @click="updateData">
      Update
    </v-btn>
    <v-btn @click="print">
      Print
    </v-btn>
    <v-tabs centered>
      <v-tab>PDF</v-tab>
      <v-tab>Template</v-tab>
      <v-tab>JSON</v-tab>

      <v-tab-item>
        <div v-html="data" id="print" />
      </v-tab-item>
      <v-tab-item>
        <v-textarea outlined v-model="template" label="Template"></v-textarea>
      </v-tab-item>
      <v-tab-item>
        <v-textarea outlined v-model="computedCV" label="JSON"></v-textarea>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as handlebars from "handlebars";
import { GetCVDetailsById } from "@/api/cv";
import CV from "@/store/CV";

@Component
export default class PDFView extends Vue {
  public id: number | null = null;
  private template = `
    <style>
    * {
      margin: 0;
      padding: 0;
    }
    #header {
      width: 100%;
      background-color: blue;
    }

    #skills {
      padding: 2em;
    }
    </style>
    <div id="container">
      <div id="header">
        <h1>This is a CV of {{ user.firstName }} {{ user.lastName }}</h1>
      </div>

      <div id="skills">
        <h3>Skills</h3>
        {{#each skills}}
          <p>{{this.id}} {{this.skillSubject.name}}</p>
        {{else}}
          <p class="empty">No content</p>
        {{/each}}
      </div>
    </div>
  `;
  private data = "";

  private cvData: CV | null = null;

  get computedCV() {
    return JSON.stringify(this.cvData, null, 2);
  }

  set computedCV(val) {
    this.cvData = JSON.parse(val);
  }

  private updateData(): void {
    this.data = handlebars.compile(this.template)(this.cvData);
  }

  private async created(): Promise<void> {
    try {
      const idStr = this.$route.params.id;
      this.id = parseInt(idStr, 10);

      await GetCVDetailsById(this.id);

      this.cvData = CV.query()
        .with("user")
        .with("skills")
        .with("skills.skillSubject")
        .find(this.id);

      this.updateData();
    } catch (err) {
      // TODO Handle this better, maybe some error notification
      this.$router.push("/");
    }
  }

  private print(): void {
    const element = document.getElementById("print");
    if (element) {
      const win = window.open(
        "",
        "Title",
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=595,height=842,top=" +
          (screen.height - 400) +
          ",left=" +
          (screen.width - 840)
      );
      if (win) {
        win.document.body.innerHTML = element.innerHTML;
        win.print();
      }
    }
  }
}
</script>
