<template>
  <div class="container">
      <input type="file" name="excel" id="excel" @change="handleFile">
  </div>
</template>
<script>
import {excel2Json} from '../../utils/utils';
export default {
  data() {
    return {};
  },
  methods: {
    handleFile(e) {
      excel2Json(e)
      // console.log(this.isRepeat(data, 'identity'))
    },
    isRepeat(a, k) {
        var n = {}
        var f = false
        a.filter((t,i)=>{
        	if (n[t[k]]){
        		f = true
        	}
        	n[t[k]] = true
        })
        return f
    }
  }
};
</script>
