<template>
  <el-dialog title="监控" :visible.sync="visible" width="40%" @close="close" @opened="opened">
    <device-run-info
      ref="deviceRunInfo"
      lang="zh-cn"
      :boiler-no="this.boilerNo"
      :controller-no="this.controllerNo"
      :address="this.address"
    ></device-run-info>
  </el-dialog>
</template>

<script>
import deviceRunInfo from "@sdcsoft/components/components/device-run-info/index";
export default {
  name: "devicedialog",
  components: {
    "device-run-info": deviceRunInfo
  },
  props: {
    boilerNo: {
      type: String,
      default: null
    },
    controllerNo: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {};
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(v) {
        this.$emit("update:show", v);
      }
    }
  },
  watch: {
    show(val) {
      this.visible = val;
    },
  },
  components: {
    deviceRunInfo: deviceRunInfo
  },
  methods: {
    opened() {
      this.$refs.deviceRunInfo.showDevice();
    },
    close() {
      this.$refs.deviceRunInfo.stopTimer(this.controllerNo);
    }
  }
};
</script>

<style scoped>
</style>
