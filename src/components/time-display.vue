<template>
  <span v-if="value">
    {{ fromNow }}
  </span>
</template>


<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Number,
      default () {
        return new Date().getTime()
      }
    }
  },

  data () {
    return {
      moment,
      fromNow: '',
      nowInterval: null,
      now: new Date().getTime()
    }
  },

  computed: {
    minValue () {
      // returns now or the value date, whichever is lower
      // this prevents "in a few seconds" output when server time is just ahead
      // of our last known current time
      return Math.min(new Date(this.value).getTime(), new Date().getTime())
    }
  },

  watch: {
    value () {
      this.updateFromNow()
    },
    now () {
      this.updateFromNow()
    }
  },

  mounted () {
    this.startInterval()
    this.updateFromNow()
  },

  methods: {
    startInterval () {
      // stop any existing interval
      if (this.nowInterval) {
        clearInterval(this.nowInterval)
      }
      // start the interval to run every minute
      this.nowInterval = setInterval(() => {
        this.now = new Date().getTime()
      }, 60 * 1000)
    },
    updateFromNow () {
      // if value is not null
      if (this.value) {
        // recalculate fromNow display value
        this.fromNow = moment.utc(this.minValue).local().fromNow()
      }
    }
  }
}
</script>
