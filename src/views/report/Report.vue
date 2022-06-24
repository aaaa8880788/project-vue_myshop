<template>
  <div>
    <!-- 面包屑导航区域 -->
    <BreadNav :BreadData="BreadData" />
    <!-- 商品列表卡片区域 -->
    <el-card>
      <!-- Echart部分 -->
      <div id="main" style="width: 1200px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
// 面包屑导航导入
import BreadNav from "@/components/common/BreadNav";

// 网络请求部分
import { getCounterData } from "@/network/report";

export default {
  name: "Report",
  components: {
    BreadNav,
  },
  data() {
    return {
      // 面包屑导航数据
      BreadData: {
        data01: "首页",
        data02: "数据统计",
        data03: "数据报表",
      },
      // Echarts需要合并数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {
    // Echarts部分
    async myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      const { data } = await getCounterData();
      // console.log(data);
      if (data.meta.status !== 200) {
        this.$message.error("获取数据失败！");
      } else {
        const optionData = { ...this.options, ...data.data };
        myChart.setOption(optionData);
      }
    },
  },
  mounted() {
    this.myEcharts();
  },
};
</script>

<style lang="less" scoped>
</style>