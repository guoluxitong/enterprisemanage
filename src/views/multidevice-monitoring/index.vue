<template>
  <el-row style="margin-top: 20px">
    <device-map :map-height="mapHeight" :medias="medias" :powers="powers" :products="products" :customers="customers" :categories="categories" ak="eqPZV35edaZZGefOIopjLNqTSj4qI89Y" @search="search" :showInfo="true" @onDeviceClicked="deviceClick"></device-map>
   <el-col :span="19">
    <el-row>
      <template  v-for="(item,index) in devices">
      <device-card
        :key="index"
        v-if="item.show"
        :array-index="index"
        :controller-no="item.device.controllerNo"
        :boiler-no="item.device.boilerNo"
        :address="item.device.address"
        @onCardClosed="cardClosed"
        :map-height="cardHeight"
      ></device-card>
      </template>
    </el-row>
   </el-col>
  </el-row>
</template>

<script>
  import { StringHashMap } from '@sdcsoft/comms'
  import { SdcSoftClient } from '@tomcat008/sdcsoftclient'
  import { DeviceAdapter,SdcSoftDevice2 } from '@tomcat008/devicelib'
  import mqtt from 'mqtt'
  import { initMedium, initFuel } from "./product-dictionary";
  import { getProductCategoryList } from "@/api/productCategory";
  import {productSearch,getDeviceNo} from "@/api/product";
  import { getList } from "@/api/customer";
 import deviceMap from "@sdcsoft/components/components/map/device-map/index";
import deviceCard from "./device-card";
export default {
  name: "index",
  components: {
    deviceMap,
    deviceCard
  },
  data() {
    return {
      client:null,
      devicelist:new StringHashMap(),
      searchOption: {
        boilerNo: "",
        customer: null,
        category: null,
        tonnageNum: null,
        media: null,
        power: null,
      },
      products: [],
      products1: [],
      deviceNo5:null,
      product: {
        boilerNo: "",
        customerName: null,
        productCategoryId: null,
        tonnageNum: null,
        media: null,
        power: null
      },
      customers: [],
      categories: [],
      powers: [],
      medias: [],
      mapHeight: document.documentElement.clientHeight / 3 + "px",
      cardHeight: document.documentElement.clientHeight,
      devices: [],
      colCount: 3,
      visible: true
    };
  },
  mounted() {
    this.initSearchOptions()
    let self = this;
    window.onresize = function() {
      self.mapHeight = document.body.clientHeight * 2 / 3+ "px";
    };
  },
  computed: {
     span: () => {
      return 24 / this.colCount;
    }
  },
  created(){
    this.client = new SdcSoftClient(mqtt,"wss://skt.sdcsoft.cn", "8084", 'sdcsoft.com.cn', '80201288@qq.com', 'ENMAP-'+this.guid())

    this.client.OnConnect = function (pt) {

    }
    this.client.Connect()
    getDeviceNo({}).then(res => {
      this.deviceNo5=res.data.data[0]
      console.log(this.deviceNo5)
      this.client.addMessageListener(this.deviceNo5, (deviceno, msg) => {
        if(msg.length == 0){
          this.devicelist.remove(deviceno)
        }else{
          this.devicelist.addItem(deviceno,deviceno)
        }

      }).then((deviceno) => {
        this.search(this.searchOption)
      })
    })
  },
  destroyed() {
    this.client.removeMessageListener(this.deviceNo5, (deviceno, msg) => {


    }).then((msg) => {
      console.log('关闭监听成功！')
    })
  },
  methods: {
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    search(searchOption) {
      this.product.controllerNo=searchOption.boilerNo;
      this.product.media=searchOption.media;
      this.product.power=searchOption.power;
      this.product.customerId=searchOption.customer;
      this.product.productCategoryId=searchOption.category
      productSearch({
        product: this.product,
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        let data = res.data;
        if (data.code) {
          this.$message.error(data.msg);
          return;
        } else {
          this.products = [];
          this.products1 = [];
          data.data.list.forEach(item => {
            if (item.isSell) {
              if (this.devicelist.getItem(item.controllerNo)) {

                this.products.push({
                  lng: item.longitude,
                  lat: item.latitude,
                  boilerNo: item.boilerNo,
                  controllerNo: item.controllerNo,
                  customerId: item.customerId,
                  address: item.street,
                  onLione:true
                });
              } else {
                this.products.push({
                  lng: item.longitude,
                  lat: item.latitude,
                  boilerNo: item.boilerNo,
                  controllerNo: item.controllerNo,
                  customerId: item.customerId,
                  address: item.street,
                  onLione:false
                });
              }
            }
          });
        }
      });
    },
    initSearchOptions() {
      getProductCategoryList().then(data => {
        this.categories = [];
        data.data.data.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          this.categories.push(optionItem);
        });
      });
      getList({ pageNum: 1, pageSize: 1000 }).then(response => {
        this.customers = [];
        response.data.data.list.forEach(item => {
          let optionItem = {};
          optionItem.value = item.id;
          optionItem.label = item.name;
          this.customers.push(optionItem);
        });
      });
      initMedium().then(data => {
        this.medias = data;
      });
      initFuel().then(data => {
        this.powers = data;
      });
    },
    deviceClick(device) {
      if (this.devices.length == 12) {
        this.$message.error("已达到设备监控上限！");
        return;
      }
      let f = true;
      for (let i = 0; i < this.devices.length; i++) {
        if (this.devices[i].device.controllerNo == device.controllerNo && this.devices[i].show) {
          f = false;
          break;
        }
      }
      if (f) {
        this.devices.push({"device":device,"show":true});
      }
    },
    cardClosed(index) {
      this.$set(this.devices[index],"show",false)
      //this.devices.splice(index, 1)
    }
  }
};
</script>
