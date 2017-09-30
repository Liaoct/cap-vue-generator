<template>
  <div class="el-hello">
      <p class="el-hello__msg">{{ msg }}</p>
      <calendar
          v-model="value1"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy年MM月dd天"></calendar>
  </div>
</template>

<script>
    import { mixinHullMethod, requestHull, waitCall } from '../common/hull';
    import { Calendar } from 'cap-ui';

    export default {
        name : 'hello',
        mixins : [mixinHullMethod],
        data() {
            return {
                msg : 'Welcome to Your Vue.js App',
                value1 : ''
            };
        },
        async mounted() {
            console.log(this);
            this.bindMethods({ saveInfo : 'saveInfo' });
            const msg = await waitCall('testHullCall');
            console.log(msg);
        },
        methods : {
            async saveInfo(data) {
                this.msg = data;
                console.log(this);
                console.log(data);
//                const res = await requestHull('saveMsg', { age : 10 });
//                console.log(res);
            }
        },
        components : {
            Calendar
        }
    };
</script>

<style>
    @component-namespace el{
        @b hello{
            text-align: center;
            @utils-vertical-center;
            height: 400px;
            overflow: hidden;
            @e msg{
                display: inline-block;
                height: 100%;
                font-size: 30px 1;
            }
        }
    }
</style>
