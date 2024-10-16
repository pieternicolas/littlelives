<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import dayjs from "dayjs";
import { START_TIMES, TIMESLOTS_DAYS } from "../SettingsForm/form";

const state = useStorage("schedule", {} as any);

const today = dayjs();
</script>

<template>
  <div class="flex-1 p-12 border-l overflow-auto">
    <p>{{ today.format("MMM YYYY") }}</p>
    <div :class="`grid grid-cols-8`">
      <div class="border bg-slate-50"></div>
      <div
        v-for="day in TIMESLOTS_DAYS"
        :key="day"
        class="capitalize border bg-slate-50"
      >
        {{ day }}
      </div>

      <template v-for="time in START_TIMES">
        <div>
          <p
            class="h-[35px] border flex items-center justify-center bg-slate-50"
          >
            {{ time }}:00
          </p>
          <p
            class="h-[35px] border flex items-center justify-center bg-slate-50"
          >
            {{ time }}:15
          </p>
          <p
            class="h-[35px] border flex items-center justify-center bg-slate-50"
          >
            {{ time }}:30
          </p>
          <p
            class="h-[35px] border flex items-center justify-center bg-slate-50"
          >
            {{ time }}:45
          </p>
        </div>
        <div v-for="day in TIMESLOTS_DAYS" :key="day" class="border">
          <div
            v-if="
              state?.timeslots?.[day]?.enabled &&
              state?.timeslots?.[day]?.startTimes?.includes(String(time))
            "
            class="bg-cyan-100 border rounded flex justify-center flex-col p-1"
            :style="{
              height: `${(35 * Number(state?.visitDuration || 0)) / 15}px`,
            }"
          >
            <p>Booked</p>
            <p>
              {{
                dayjs()
                  .hour(Number(time || 0))
                  .minute(0)
                  .format("h:mm a")
              }}

              -

              {{
                dayjs()
                  .hour(Number(time || 0))
                  .minute(0)
                  .add(Number(state?.visitDuration || 0), "minutes")
                  .format("h:mm a")
              }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
