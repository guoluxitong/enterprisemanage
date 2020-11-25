<template>
  <div style="margin-top: 20px">
    <div class="map-container">
      <div>
        <device-map :map-height="mapHeight" :medias="medias" :powers="powers" :products="products" :customers="customers" :categories="categories" ak="eqPZV35edaZZGefOIopjLNqTSj4qI89Y" @search="search" @onDeviceClicked="deviceClick" :show-full-btn="true"></device-map>
      </div>
      <device-dialog
        ref="deviceRunInfoDialog"
        :boiler-no="this.boilerNo"
        :controller-no="this.controllerNo"
        :address="this.address"
        :show.sync="deviceDialogVisible"
      ></device-dialog>
    </div>
  </div>
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
import deviceDialog from "./device-dialog/index";

export default {
  name: "map-index",
  components: {
    'device-map':deviceMap,
    deviceDialog
  },
  data() {
    return {
      deviceDialogVisible: false,
      address: "",
      client:null,
      devicelist:new StringHashMap(),
      controllerNo: "",
      boilerNo: null,
      product: {
        boilerNo: "",
        customerId: null,
        productCategoryId: null,
        tonnageNum: null,
        media: null,
        power: null
      },
      deviceNo5:null,
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
      customers: [],
      categories: [],
      powers: [],
      medias: [],
      mapHeight: document.documentElement.clientHeight - 100+ "px"
    };
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
  computed: {
    fullMap() {
      return this.$store.state.app.fullMap;
    }
  },
  mounted() {
    this.initSearchOptions()
  },
  watch: {
    fullMap(val) {
      if (val) {
        this.mapHeight = document.documentElement.clientHeight - 10 + "px";
      } else {
        this.mapHeight = document.documentElement.clientHeight - 100 + "px";
      }
    }
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
if(this.devicelist.getItem(item.controllerNo)){

  this.products.push({
    lng: item.longitude,
    lat: item.latitude,
    boilerNo: item.boilerNo,
    controllerNo: item.controllerNo,
    customerId:item.customerId,
    address: item.street,
    onLione:true
  });
}else{
  this.products.push({
    lng: item.longitude,
    lat: item.latitude,
    boilerNo: item.boilerNo,
    controllerNo: item.controllerNo,
    customerId:item.customerId,
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
      this.address = device.address;
      this.controllerNo = device.controllerNo;
      this.boilerNo = device.boilerNo;
      this.deviceDialogVisible = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.map-container {
  .map {
    width: 100%;
  }
}
</style>
