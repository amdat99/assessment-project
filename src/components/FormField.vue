<script lang="ts">
import Vue from "vue";
import { BFormGroup, BFormInput, BListGroup, BListGroupItem } from "bootstrap-vue";
import { fetchPostcodes } from "@/core/fetchPostcodes";
import { FormFields } from "@/types";

export default Vue.extend({
  name: "FormField",
  components: {
    BFormGroup,
    BFormInput,
    BListGroup,
    BListGroupItem,
  },
  props: {
    field: {
      type: Object as () => FormFields,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localValue: this.value,
      suggestions: [] as string[],
    };
  },
  watch: {
    value(newValue) {
      this.localValue = newValue;
    },
    localValue(newValue) {
      this.$emit("input", newValue);
      this.validateInput(newValue);
    },
  },
  methods: {
    validateInput(value: string) {
      let error = "";
      if (this.field.required && !value) {
        error = "This field is required.";
      } else if (this.field.type === "postcode" && value.length < 3) {
        error = "Postcode must be at least 3 characters.";
      }
      this.$emit("update-error", error);
    },
    async fetchPostcodeSuggestions() {
      if (this.localValue.length >= 3) {
        try {
          const postcodes = await fetchPostcodes(this.localValue);
          this.suggestions = postcodes;
        } catch (error) {
          this.$emit("update-error", "Failed to fetch postcode suggestions.");
        }
      }
    },
    selectSuggestion(suggestion: string) {
      this.localValue = suggestion;
      this.suggestions = []; 
      // this.$emit("input", suggestion); 
    },
  },
});
</script>

<template>
  <b-form-group :label="field.label" class="mb-2" :state="errorMessage ? false : null">
    <b-form-input
      v-if="field.type === 'input' || field.type === 'postcode'"
      v-model="localValue"
      @input="fetchPostcodeSuggestions"
      :state="errorMessage ? false : null"
      :name="field.name"
      :label="field.label"
      :placeholder="field.placeholder"
      :type="field.subType || 'text'"
      :max="field.subType === 'date' ? field.maxDate : undefined"
      :required="field.required"
    />
    <b-list-group v-if="field.type === 'postcode' && suggestions.length > 0">
      <b-list-group-item 
        v-for="suggestion in suggestions" 
        :key="suggestion" 
        @click="selectSuggestion(suggestion)"
        style="cursor: pointer;"
      >
        {{ suggestion }}
      </b-list-group-item>
    </b-list-group>
    <p v-if="errorMessage" class="text-danger m-0">{{ errorMessage }}</p>
  </b-form-group>
</template>
