<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";

export default Vue.extend({
  name: "FormView",
  components: {
    FormComponent,
    TextComponent,
    SubmitComponent,
  },
});
</script>

<template>
  <div>
    <FormComponent>
      <template v-slot:title>
        <TextComponent type="h1" text="Test Form" />
      </template>

      <template v-slot:subtitle>
        <TextComponent type="h3" text="This is a test form." />
      </template>

      <template v-slot:question>
        <div class="form-group">
          <label for="exampleInput">Example Question</label>
          <input
            type="text"
            class="form-control"
            id="exampleInput"
            placeholder="Enter answer"
          />
        </div>
      </template>

      <template v-slot:submit>
        <SubmitComponent text="Submit" />
      </template>
    </FormComponent>
  </div>
</template>
