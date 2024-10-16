<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useStorage } from "@vueuse/core";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { settingsFormSchema, DURATION_LIMITS, TIMESLOTS_DAYS } from "./form.ts";

import AvailabilityForm from "./AvailabilityForm.vue";

defineProps();

const state = useStorage("schedule", {} as any);

const { handleSubmit, values, setFieldValue } = useForm({
  validationSchema: toTypedSchema(settingsFormSchema),
  initialValues: {
    ...state.value,
    visitDuration: String(state.value?.visitDuration),
  },
});

const onSubmit = handleSubmit((values) => {
  console.log("Form submitted!", values);
  state.value = values;
});

const resetAvailability = (day: (typeof TIMESLOTS_DAYS)[number]) => {
  setFieldValue(`timeslots.${day}.enabled`, false);
};
</script>

<template>
  <div class="w-1/3 h-full flex p-12">
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <FormField v-slot="{ componentField }" name="visitDuration">
        <FormItem>
          <FormLabel>Visit Duration</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="limit in DURATION_LIMITS"
                  :key="limit"
                  :value="String(limit)"
                >
                  {{ limit }} min
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="numberOfBookingSlots">
        <FormItem>
          <FormLabel>No. Booking / Session</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              max="99"
              placeholder="1"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ value, handleChange }"
        type="checkbox"
        name="allowVideoTourCall"
      >
        <FormItem class="flex flex-row items-start gap-x-3 space-y-0">
          <FormControl>
            <Checkbox :checked="value" @update:checked="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>Allow video tour call</FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <div class="border rounded-lg p-4">
        <p>Availability</p>
        <p>Set your weekly recurring schedule</p>

        <div class="flex flex-col gap-3">
          <div v-for="day in TIMESLOTS_DAYS" class="flex gap-2">
            <AvailabilityForm
              :day="day"
              :visit-duration="values?.visitDuration"
              :enabled="values?.timeslots?.[day]?.enabled"
              @reset-availability="resetAvailability"
            />
          </div>
        </div>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  </div>
</template>
