<template>
<div class="form">
<h2 class="settings-label is-size-7 has-text-weight-light has-text-left">Settings</h2>
<div class="field is-horizontal">
<div class="field-label is-small">
  <label class="label text-left">Subdivisions</label>
</div>
<div class="field-control">
  <div class="control">
    <input class="input is-small" type="number" v-model="subdivisions">
  </div>
 </div>
</div>
<div class="field is-horizontal">
<div class="field-label is-small">
  <label class="label">Wireframe</label>
</div>
<div class="field-control">
<label class="checkbox">
    <input class="checkbox is-small" type="checkbox" v-model="wireframe">
</label>
</div>

</div>
</div>
</template>
<script>
export default {
    data(){
        return {
            wireframe: false,
            subdivisions:12
        }
    }
}
</script>
<style>
.label {
    text-align:left;
}
.settings-label{
    margin-bottom: 24px;
}
</style>