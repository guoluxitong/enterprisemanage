<template>
  <div style="margin-top: 20px">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!productRepairDialogVisibleuser">
        <el-tab-pane label="锅炉维保记录" name="repairdevice">
          <div>
            <el-row>
              <el-col :span="3">
            <el-select
              clearable
              style="width: 150px"
              v-model="product.customerName"
              placeholder="客户名称"
            >
              <el-option
                v-for="item in customerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
              </el-col>
              <el-col :span="3">
            <el-input v-model="product.controllerNo" placeholder="锅炉编号" style="width: 150px;"></el-input>
              </el-col>
              <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              </el-col>
            </el-row>
            <el-table
              :data="productList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              @open="handleClick"
              @row-contextmenu="openTableMenu"
            >
              <el-table-column :show-overflow-tooltip="true" align="left" label="锅炉编号">
                <template slot-scope="scope">
                  <span>{{scope.row.controllerNo}}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="left" label="燃料">
                <template slot-scope="scope">
                  <span>{{scope.row.power | dictionaryValueFieldFilter(fuelArray)}}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="left" label="介质">
                <template slot-scope="scope">
                  <span>{{scope.row.media | dictionaryValueFieldFilter(mediumArray)}}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="left" label="吨位（T）">
                <template slot-scope="scope">
                  <span>{{scope.row.tonnageNum}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    circle
                    icon="el-icon-view"
                    type="success"
                    @click="repairinfo(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <el-pagination
                background
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="currentPage1"
                :page-sizes="[5]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="productList.length"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="员工维保记录" name="repairuser">
          <div>
            <el-row>
              <el-col :span="4">
            <el-autocomplete
              v-model="userlist.userName"
              :fetch-suggestions="querySearchAsyncuser3"
              placeholder="请输入内容"
              @select="((item)=>{handleSelectuser3(item)})"
            ></el-autocomplete>
              </el-col>
            </el-row>
            <el-table
              :data="userlist.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              border
              fit
              highlight-current-row
            >
              <el-table-column align="left" :show-overflow-tooltip="true" label="真实姓名">
                <template slot-scope="scope">
                  <span>{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" :show-overflow-tooltip="true" label="职务">
                <template slot-scope="scope">
                  <span>{{scope.row.roleName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    circle
                    icon="el-icon-view"
                    type="success"
                    @click="repairinfouser(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <el-pagination
                background
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="currentPage1"
                :page-sizes="[5]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="userlist.length"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="productRepairDialogVisibleuser">
      <el-form>
        <el-row>
          <el-col :span="6">
            <el-date-picker
              type="date"
              placeholder="选择查询起始日期"
              v-model="starttime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              type="date"
              placeholder="选择查询结束日期"
              v-model="endtime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="19">
                <el-button
                style="margin-left:20px"
                icon="el-icon-search"
                type="primary"
                @click="queryByTimeuser"
              >查询</el-button>
              <el-button
                style="margin-left:20px"
                icon="el-icon-plus"
                type="success"
                @click="repairAdduser"
              >添加</el-button>
              </el-col>
               <el-col :span="5">
              <el-button
                style="margin-left:20px"
                type="warning"
                icon="el-icon-back"
                @click="canceluser"
              >取消</el-button>
               </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="repairuserList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
            align="center"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            style="width: 100%"
            max-height="600"
            @selection-change="getDetails"
          >
            <el-table-column align="center" label="序号" width="150" v-if="false">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="titleName=='员工维保记录'" align="center" label="设备编号" width="130">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.controllerNo }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="日期" width="170">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ dateFormat(scope.row.repairDatetime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="录入人" width="130">
              <template slot-scope="scope">
                <span size="medium">{{ scope.row.createUserName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="维保人员" width="130">
              <template slot-scope="scope">
                <span size="medium">{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="录入时间" width="170">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ dateFormat(scope.row.createDatetime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="维保内容" width="450">
              <template slot-scope="scope">
                <span size="medium">{{ scope.row.repairContent }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  circle
                  icon="el-icon-delete"
                  type="danger"
                  @click="repairdeleteuser(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[5]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="repairuserList.length"
          ></el-pagination>
        </div>
        <el-dialog
          :append-to-body="true"
          :title="titleName"
          @close='closeDialog'
          :visible.sync="newRepairDialogFlaguser"
        >
          <el-form ref="repairformdata" v-model="repairform" label-width="80px">
            <el-form-item v-if="inputno" label="产品编号">
              <el-autocomplete
                v-model="repairform.controllerNo"
                :fetch-suggestions="querySearchAsyncuser"
                placeholder="请输入内容"
                @select="((item)=>{handleSelectuser(item)})"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item v-if="inputname" label="维保人员">
              <el-autocomplete
                v-model="repairform.realName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="((item)=>{handleSelect1(item)})"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="维保时间">
              <el-col :span="24">
                <el-date-picker
                  value-format="yyyy-MM-dd hh:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                  v-model="repairform.repairDatetime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="维保内容">
              <el-input type="textarea" v-model="repairform.repairContent"></el-input>
            </el-form-item>
            <el-form-item>
              <el-row>
                <el-col :offset="15" :span="4">
              <el-button type="primary" @click="submitRepairuser">确定</el-button>
                </el-col>
                <el-col :span="3">
              <el-button type="warning" icon="el-icon-back" @click="cancelbuuser">取消</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-form>
    </div>
    <boiler-common-delete-validate-dialog
      @confirmDeleteValidate="confirmDeleteValidate"
      @confirmCancelValidate="confirmCancelValidate"
      :deleteValidateFormDialogVisible="deleteValidateFormDialogVisible"
      :id="delId"
    ></boiler-common-delete-validate-dialog>
  </div>
</template>
<script>
import { productSearch } from "@/api/product";
import boilerCommonDeleteValidate from "@/views/boiler-common-delete-validate";
import { getList } from "@/api/customer";
import { initMedium, initFuel } from "@/views/product/product-dictionary";
import { formatDateTime } from "@/utils/date";
import {
  getRepairInfoListByDate,
  insertRepairInfo,
  getRepairInfoListByProductId,
  getRepairInfoListBydate,
  getRepairInfoListByUserId,
  deleteRepairInfoByProductId
} from "@/api/RepairInfo";
import { getUserList, getUserListByName } from "@/api/user";
function dictionaryValueFilter(dictionaryValue, value) {
  const dictionaryValueItem = dictionaryValue.filter(item => {
    return item.value == value;
  });
  return dictionaryValueItem[0];
}
export default {
  name: "repair",
  components: {
    "boiler-common-delete-validate-dialog": boilerCommonDeleteValidate
  },
  data() {
    return {
      activeName: "repairdevice",
      tabType: "",
      productList: [],
      productRepairDialogVisible: false,
      productRepairDialogVisibleuser: false,
      newRepairDialogFlag: false,
      newRepairDialogFlaguser: false,
      repairform: [
        {
          userName: "",
          repairDatetime: "",
          repairContent: "",
          realName: "",
          createDatetime: "",
          createUserName: "",
          userId: "",
          controllerNo: "",
          id: "",
          boilerNo: "",
        }
      ],
      userListRepair: [],
      boilerNoList: [],
      mediumArray: [],
      fuelArray: [],
      listLoading: false,
      repairUserName: "",
      productId: "",
      repairUserId: "",
      inputname: true,
      inputno: false,
      userFormData: "",
      userlist: [],
      selectlistRow: [],
      starttime: "",
      endtime: "",
      titleName: "",
      deindex: "",
      restaurants: [],
      repairList: [],
      repairuserList: [],
      currentPage1: 1,
      pageNum1: 1,
      pageSize1: 5,
      deleteId: -1,
      pageNum: 1,
      pageSize: 5,
      productFormData: {},
      listQuery: {
        total: 50,
        pageNum: 1,
        pageSize: 5,
        realName: "",
        mobile: null,
        orgType: this.$store.state.user.orgType,
        orgId: this.$store.state.user.orgId
      },
      userListArry: [],
      userArry: [],
      product: {
        boilerNo: "",
        saleDate: null,
        controllerNo: "",
        customerName: null,
        productCategoryId: null,
        tonnageNum: null,
        media: null,
        power: null,
        userId: null,
        isSell: null
      },
      deleteValidateFormDialogVisible: false,
      product1: {
        boilerNo: "",
        saleDate: null,
        controllerNo: "",
        customerName: null,
        productCategoryId: null,
        tonnageNum: null,
        media: null,
        power: null,
        userId: null,
        isSell: null
      },
      delId: -1,
      customerList: [],
      listQuery2: {
        total: 500,
        pageNum: 1,
        pageSize: 50,
        realName: "",
        mobile: null,
        orgId: this.$store.state.user.orgId
      },
      userlistQuery2: {
        total: 500,
        pageNum: 1,
        pageSize: 50,
        orgId: this.$store.state.user.orgId
      },
      userlistQuery: {
        total: 50,
        pageNum: 1,
        pageSize: 5,
        userName: "",
        orgId: this.$store.state.user.orgId
      }
    };
  },
  filters: {
    dictionaryValueFieldFilter(value, dictionaryValueArray) {
      if (dictionaryValueFilter(dictionaryValueArray, value))
        return dictionaryValueFilter(dictionaryValueArray, value).label;
      return;
    },
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "danger"
      };
      return statusMap[status];
    },
    statusFilterLabel(status, isAvailableArray) {
      return isAvailableArray.filter(item => {
        return item.value == status;
      });
    }
  },
  created() {
    this.getWaterDetails(0);

  },
  methods: {
    inintRepair(){
      this.repairform = [
        {
          userName: "",
          repairDatetime: "",
          repairContent: "",
          realName: "",
          createDatetime: "",
          createUserName: "",
          userId: "",
          controllerNo: "",
          id: "",
          boilerNo: "",
        }
      ]
    },
    initSelectMedium() {
      initMedium().then(data => {
        this.mediumArray = data;
      });
      initFuel().then(data => {
        this.fuelArray = data;
      });
    },
    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    handleClick(tab, event) {
      var val = tab.index;
      console.log(val)
      this.getWaterDetails(val);
    },
    closeDialog(){
      this.inintRepair()
    },
    inintUserSelect() {
      getUserList(this.userlistQuery).then(response => {
        if (response.data.code == 0) {
          this.userListArry = response.data.data.list;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    querySearchAsyncuser3(queryString, callback) {
      this.userArry = [];
      var results = [];
      for (let i = 0, len = this.userListArry.length; i < len; i++) {
        this.userListArry[i].value = this.userListArry[i].userName;
      }
      this.userArry = this.userListArry;
      results = queryString
        ? this.userArry.filter(this.createFilteruser3(queryString))
        : this.userArry;
      callback(results);
    },
    createFilteruser3(queryString, queryArr) {
      return queryArr => {
        return (
          queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelectuser3(item) {
      this.userlist = [];
      this.userlist.push(item)
    },
    initSelect() {
      getList(this.listQuery2).then(response => {
        this.customerList = this.getcustomerListOptions(
          response.data.data.list
        );
      });
    },
    repairinfo(index, row) {
      this.productRepairDialogVisibleuser = true;
      this.productFormData = row;
      this.titleName = "锅炉维保记录";
      this.inputname = true;
      this.inputno = false;
      this.getrepairList();
    },
    repairinfouser(index, row) {
      this.productRepairDialogVisibleuser = true;
      this.userFormData = row;
      this.titleName = "员工维保记录";
      this.inputname = false;
      this.inputno = true;
      this.getrepairListuser();
    },
    cancelbu() {
      this.newRepairDialogFlag = false;
      this.titleName = "维保记录";
    },
    cancel() {
      this.productRepairDialogVisible = false;
      this.titleName = "维保记录";
    },
    cancelbuuser() {
      this.inintRepair()
      this.newRepairDialogFlaguser = false
      this.titleName = "维保记录";
    },
    canceluser() {
      this.currentPage1 = 1;
      this.productRepairDialogVisibleuser = false;
      this.repairuserList = [];
      this.titleName = "维保记录";
    },
    repairAdd() {
      this.newRepairDialogFlag = true;
      this.titleName = "添加维保记录";
    },
    repairAdduser() {
      this.newRepairDialogFlaguser = true;
      this.titleName = "添加维保记录";
    },
    repairdeleteuser(index, row) {
      this.deleteValidateFormDialogVisible = true;
      this.delId = row.id;
    },
    confirmDeleteValidate(obj) {
      if (obj.flag) {
        this.deleteValidateFormDialogVisible =
          obj.deleteValidateFormDialogVisible;
        deleteRepairInfoByProductId(obj.id).then(response => {
          if (response.data.code == 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.currentPage1 =(this.repairuserList.length-1)%this.pageSize1 == 0 ? this.currentPage1-1 : this.currentPage1
          if (this.inputname) {
            this.getrepairList();
          } else {
            this.getrepairListuser();
          }
          } else {
            this.$message.error(response.data.msg)
            return;
          }
        });
      } else {
        this.deleteValidateFormDialogVisible = false;
        this.delId = null;
        this.$message.error("输入密码错误，无法完成删除操作！");
      }
    },
    confirmCancelValidate(obj) {
      this.deleteValidateFormDialogVisible =
        obj.deleteValidateFormDialogVisible;
    },
    getcustomerListOptions(dataList) {
      let options = [];
      dataList.forEach(item => {
        let optionItem = {};
        optionItem.value = item.name;
        optionItem.label = item.name;
        options.push(optionItem);
      });
      return options;
    },
    openTableMenu(row, event) {
      this.$refs.menuContext.openTableMenu(
        row,
        event,
        window.event.clientX,
        window.event.clientY
      );
    },
    handleFilter() {
      this.listLoading = true;
      this.listQuery.pageNum = 1;
      productSearch({
        product: this.product,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {
        if (response.data.code == 0) {
          let productInfoList = response.data.data;
          this.productList = productInfoList.list;
          this.listQuery.total = productInfoList.total;
          this.listQuery.pageNum = productInfoList.pageNum;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    getrepairList() {
      this.listLoading = true;
      getRepairInfoListByProductId({
        productId: this.productFormData.id
      }).then(response => {
        if (response.data.code == 0) {
          let repairInfoList = response.data.data;
          this.repairuserList = repairInfoList;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    getrepairListuser() {
      this.listLoading = true;
      getRepairInfoListByUserId(this.userFormData.id).then(response => {
        if (response.data.code == 0) {
          let repairInfoList = response.data.data;
          this.repairuserList = repairInfoList;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    querySearchAsync(queryString, callback) {
      var results = [];
      for (let i = 0, len = this.userListRepair.length; i < len; i++) {
        this.userListRepair[i].value = this.userListRepair[
          i
        ].userName;
      }
      results = queryString
        ? this.userListRepair.filter(this.createFilter(queryString))
        : this.userListRepair;
      callback(results);
    },
    createFilter(queryString, queryArr) {
      return queryArr => {
        return (
          queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect1(item) {
      this.repairform.userId = item;
    },
    querySearchAsyncuser(queryString, callback) {
      var results = [];
      for (let i = 0, len = this.boilerNoList.length; i < len; i++) {
        this.boilerNoList[i].value = this.boilerNoList[
          i
        ].controllerNo;
      }
      results = queryString
        ? this.boilerNoList.filter(
            this.createFilteruser(queryString)
          )
        : this.boilerNoList;
      callback(results);
    },

    createFilteruser(queryString, queryArr) {
      return queryArr => {
        return (
          queryArr.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelectuser(item) {
      this.repairform.productId = item;
    },
    submitRepairuser() {
      var createDatetime = formatDateTime(
        new Date(),
        "yyyy-MM-dd hh:mm:ss"
      );
      if (this.inputname) {
        insertRepairInfo({
          userName: this.repairform.realName,
          repairDatetime: this.repairform.repairDatetime,
          createDatetime: createDatetime,
          createUserName: this.$store.getters.realName,
          createUserId: this.$store.getters.userId,
          repairContent: this.repairform.repairContent,
          productId: this.productFormData.id,
          userId: this.repairform.userId.id
        }).then(data => {
          if (data.data.code == 0) {
            this.newRepairDialogFlaguser = false;
            this.titleName = "维保记录";
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.inintRepair()
            this.getrepairList();
          } else {
            this.$message.error(data.data.msg);
            return;
          }
        });
      } else {
        insertRepairInfo({
          userName: this.userFormData.userName,
          repairDatetime: this.repairform.repairDatetime,
          createDatetime: createDatetime,
          createUserName: this.$store.getters.realName,
          createUserId: this.$store.getters.userId,
          repairContent: this.repairform.repairContent,
          productId: this.repairform.productId.id,
          userId: this.userFormData.id
        }).then(data => {
          if (data.data.code == 0) {
            this.newRepairDialogFlaguser = false;
            this.titleName = "维保记录";
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.inintRepair()
            this.getrepairListuser();
          } else {
            this.$message.error(data.data.msg);
            return;
          }
        });
      }
    },
    //分页
    handleSizeChange1: function(pageSize) {
      this.pageSize1 = pageSize;
      this.handleCurrentChange1(this.currentPage);
    },
    handleCurrentChange1: function(currentPage) {
      //页码切换
      this.currentPage1 = currentPage;
    },
    getrepairListBydate() {
      this.listLoading = true;
      var starttime = formatDateTime(
        new Date(this.starttime),
        "yyyy-MM-dd hh:mm:ss"
      );
      var endtime = formatDateTime(
        new Date(this.endtime),
        "yyyy-MM-dd hh:mm:ss"
      );
      getRepairInfoListByDate({
        productId: this.productFormData.id,
        startTime: starttime,
        endTime: endtime
      }).then(response => {
        if (response.data.code == 0) {
          let repairInfoList = response.data.data;
          this.repairuserList = repairInfoList;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    getrepairListBydateuser() {
      this.listLoading = true;
      var starttime = formatDateTime(
        new Date(this.starttime),
        "yyyy-MM-dd hh:mm:ss"
      );
      var endtime = formatDateTime(
        new Date(this.endtime),
        "yyyy-MM-dd hh:mm:ss"
      );
      getRepairInfoListBydate({
        userId: this.userFormData.id,
        endTime: endtime,
        startTime: starttime
      }).then(response => {
        if (response.data.code == 0) {
          let repairInfoList = response.data.data;
          this.repairuserList = repairInfoList;
          this.listLoading = false;
        } else {
          this.$message.error(response.data.msg);
          return;
        }
      });
    },
    queryByTimeuser() {
      if (this.starttime.getTime() > this.endtime.getTime()) {
        alert("起始时间必须小于结束时间");
      } else {
        if (this.inputname) {
          this.getrepairListBydate();
        } else {
          this.getrepairListBydateuser();
        }
      }
    },
    getDetails(row) {
      this.deleteId = row.id;
    },
    getWaterDetails(val) {
      this.initSelectMedium();
      if (val == 0) {
        this.initSelect();
        this.userlist = [];
        getUserList(this.userlistQuery2).then(response => {
          this.userListRepair = response.data.data.list;
        });
      }
      if (val == 1) {
        this.inintUserSelect();
        this.productList = [];
        productSearch({
          product: this.product1,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(response => {
          this.boilerNoList = response.data.data.list;
        });
      }
    }
  }
};
</script>
