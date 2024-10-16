<script setup lang="ts">
import { useFieldArray } from "vee-validate";
import dayjs from "dayjs";

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

import { START_TIMES, TIMESLOTS_DAYS } from "./form";
import { CirclePlus, Trash2 } from "lucide-vue-next";

const props = defineProps<{
  day: (typeof TIMESLOTS_DAYS)[number];
  visitDuration?: string | number;
  enabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "resetAvailability", day: (typeof TIMESLOTS_DAYS)[number]): void;
}>();

const { fields, replace, push, remove } = useFieldArray(
  `timeslots.${props.day}.startTimes`
);
</script>

<template>
  <FormField
    v-slot="{ value, handleChange }"
    type="checkbox"
    :name="`timeslots.${day}.enabled`"
  >
    <FormItem class="flex flex-row items-start gap-x-3 space-y-0 w-[80px] pt-3">
      <FormControl>
        <Checkbox
          :checked="value"
          @update:checked="
            (val) => {
              handleChange(val);
              if (val) {
                replace(['7']);
              }
            }
          "
        />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel class="capitalize">{{ day }}</FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>

  <div v-if="enabled" class="flex flex-col gap-2 flex-1">
    <div
      v-for="(field, idx) in fields"
      :key="field.key"
      class="flex items-center gap-1 flex-1"
    >
      <FormField
        v-slot="{ componentField }"
        :name="`timeslots.${day}.startTimes.${idx}`"
      >
        <FormItem class="flex-1">
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="time in START_TIMES"
                  :key="time"
                  :value="String(time)"
                >
                  {{ dayjs().hour(time).minute(0).format("h:mm a") }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <span>-</span>

      <Input
        type="text"
        disabled
        :value="
          field.value && props?.visitDuration
            ? dayjs()
                .hour(Number(field.value || 0))
                .minute(0)
                .add(Number(props?.visitDuration || 0), 'minutes')
                .format('h:mm a')
            : ''
        "
      />

      <span @click="push('7')" class="cursor-pointer"><CirclePlus /></span>

      <span
        @click="
          () => {
            remove(idx);
            if (field.isLast) {
              emits('resetAvailability', props?.day);
            }
          }
        "
        class="cursor-pointer"
        ><Trash2
      /></span>
    </div>
  </div>

  <div v-else>
    <p class="pt-2">Unavailable</p>
  </div>
</template>
