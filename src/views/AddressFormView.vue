<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import FormComponent from "@/components/form.vue";
import FormField from "@/components/FormField.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";
import store from "@/store";
import { Address, User, FormFields } from "@/types";

const THREE_YEARS_IN_MILLISECONDS = 94608000000;
const defaultAddress = { line1: "", postcode: "", dateMovedIn: "" };
const maxDate = new Date().toISOString().split("T")[0];

export default Vue.extend({
  components: {
    FormComponent,
    FormField,
    TextComponent,
    SubmitComponent,
  },
  data() {
    return {
      errorArray: [{ ...defaultAddress }] as Record<string, string>[],
      formArray: [{ ...defaultAddress }] as Address[] &
        Record<string, string>[],
      formFields: [
        {
          type: "input",
          label: "Address Line 1",
          placeholder: "Enter address line 1",
          required: true,
          name: "line1" as keyof Address,
        },
        {
          type: "input",
          subType: "date",
          label: "Date Moved In",
          placeholder: "Enter date moved in",
          required: true,
          name: "dateMovedIn" as keyof Address,
          max: maxDate,
        },
        {
          type: "postcode",
          label: "Postcode",
          placeholder: "Enter postcode",
          name: "postcode" as keyof Address,
        },
      ] as FormFields[],
      submissionError: "",
      submissionSuccess: false,
    };
  },
  computed: {
    ...mapGetters(["userData"]),
    userName(): string {
      const user = this.$store.getters["userData"] as User | null;
      return user?.firstName || "User";
    },
    canAddMoreAddresses(): boolean {
      if (
        this.formArray.length === 0 ||
        !this.formArray[0].dateMovedIn ||
        this.formArray.length > 2
      ) {
        return false;
      } else if (this.formArray.length > 1 && !this.formArray[1].dateMovedIn) {
        return false;
      }
      return !this.has3yearsHistory();
    },
    maxDate(): string {
      return new Date().toISOString().split("T")[0];
    },
  },
  methods: {
    addAddress() {
      if (!this.canAddMoreAddresses) return;
      this.errorArray.push({ ...defaultAddress });
      this.formArray.push({ ...defaultAddress });
    },
    deleteAddress(index: number) {
      if (this.formArray.length === 1) return;
      this.errorArray.splice(index, 1);
      this.formArray.splice(index, 1);
    },
    has3yearsHistory(): boolean {
      let totalDatesDifference = 0;
      const currentTimeStamp = Date.now();
      for (const address of this.formArray) {
        totalDatesDifference +=
          currentTimeStamp - new Date(address.dateMovedIn).getTime();
      }
      //Check if the total difference is less than 3 years in milliseconds
      if (totalDatesDifference < THREE_YEARS_IN_MILLISECONDS) {
        return false;
      }

      return true;
    },
    async handleSubmit(data: Address[]) {
      this.submissionError = "";
      if (!this.has3yearsHistory())
        return (this.submissionError =
          "You must provide address history for the past 3 years");

      try {
        await store.dispatch("onCreateClaim", data);
        this.submissionSuccess = true;
        this.formArray = [{ ...defaultAddress }];
        this.errorArray = [{}];
      } catch (error) {
        this.submissionError = "Failed to submit form";
        console.error("Failed to submit form", error);
      }
    },
  },
});
</script>

<template>
  <div>
    <FormComponent
      :error-array="errorArray"
      :form-fields="formFields"
      :form-array="formArray"
      :submission-error="submissionError"
      @submit="handleSubmit"
    >
      <template v-slot:title>
        <TextComponent type="h1" :text="`Welcome Back, ${userName}`" />
      </template>
      <template v-slot:subtitle>
        <TextComponent
          type="h3"
          text="Please provide your address history for the past 3 years"
        />
      </template>
      <template v-slot:question>
        <div v-for="(form, index) in formArray" :key="index" class="mb-4">
          <div class="d-flex justify-content-between">
            <TextComponent type="h4" :text="`Address History ${index + 1}`" />
            <b-button
              v-if="formArray.length > 1"
              @click="deleteAddress(index)"
              variant="danger"
              size="sm"
              type="button"
              >Delete</b-button
            >
          </div>
          <FormField
            v-for="(field, fieldIndex) in formFields"
            v-model="formArray[index][field.name]"
            :key="fieldIndex"
            :field="field"
            :errorMessage="errorArray[index][field.name]"
            @update-error="errorArray[index][field.name] = $event"
          />
        </div>
        <b-button class="mr-2" v-if="canAddMoreAddresses" @click="addAddress"
          >Add Another Address</b-button
        >
        <TextComponent
          v-if="submissionSuccess"
          type="h4"
          text="Information submitted successfully"
          classes="text-success mt-2"
        />
      </template>
      <template v-slot:submit>
        <SubmitComponent text="Submit" />
      </template>
    </FormComponent>
  </div>
</template>
