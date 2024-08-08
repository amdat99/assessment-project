<script lang="ts">
import Vue from "vue";
import { BForm } from "bootstrap-vue";
import TextComponent from "@/components/Text.vue";
import { FormFields } from "@/types";

export default Vue.extend({
  name: "FormComponent",
  components: {
    BForm,
    TextComponent,
  },
  props: {
    formFields: {
      type: Array as () => FormFields[],
      required: false,
    },
    formArray: {
      type: Array as () => Record<string, string>[],
      required: false,
      default: () => [],
    },
    errorArray: {
      type: Array as () => Record<string, string>[],
      required: false,
      default: () => [],
    },
    submissionError: {
      type: String,
      required: false,
      default: "",
    },
    submissionSuccess: {
      type: String,
      required: false,
      default: "",
    },
  },
  methods: {
    validateForm(): boolean {
      let isValid = true;

      this.formArray.forEach((formObject, index) => {
        const fieldErrors = this.validateFields(formObject);
        this.$set(this.errorArray, index, fieldErrors);
        if (Object.keys(fieldErrors).length > 0) isValid = false;
      });

      return isValid;
    },

    validateFields(formObject: Record<string, string>): Record<string, string> {
      const errors: Record<string, string> = {};

      this.formFields.forEach((field) => {
        if (field.required && !formObject[field.name]) {
          errors[field.name] = "This field is required.";
        }
      });

      return errors;
    },

    onFormSubmit() {
      if (!this.validateForm()) return;
      this.$emit("submit");
    },
  },
});
</script>

<template>
  <b-form class="container-fluid p-4" @submit.prevent="onFormSubmit">
    <div class="row mb-3">
      <div class="col-12 text-center">
        <slot name="title"></slot>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 text-center">
        <slot name="subtitle"></slot>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <slot name="question"></slot>
      </div>
    </div>
    <div class="row mb-3">
      <TextComponent
        v-if="submissionError"
        type="h6"
        :text="submissionError"
        classes="text-danger mt-2"
      />
      <TextComponent
        v-if="submissionSuccess && !submissionError"
        type="h4"
        :text="submissionSuccess"
        classes="text-success mt-2"
      />
      <div class="col-12 text-center">
        <slot name="submit"></slot>
      </div>
    </div>
  </b-form>
</template>
