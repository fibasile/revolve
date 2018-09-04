<template>
<div class="gui section">
<h1>Select a design</h1>
<div class="designs">
    No design available
</div>
<hr>

<button @click="createDesign">Create new design</button>
</div>
</template>

<script>
export default {
    methods:{
        createDesign(){
            this.$router.push('/new')
        }
    }
}
</script>

<style>
.designs{
    min-height: 300px;
}
</style>