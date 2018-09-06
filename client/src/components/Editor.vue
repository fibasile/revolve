<template>
<div class="section editor">
        <div class="columns">
            <div class="column is-8">
                 <div class="shape-panel box">
                    <ShapeEditor @previewUpdated="previewUpdated"/>
                </div>
            </div>
            <div class="column is-4">
                <div class="preview-panel box">
                    <PreviewPanel :mesh="previewMesh"/>
                </div>
                 <div class="settings-panel box">
                    <SettingsPanel/>
                </div>
            </div>
        </div>
</div>
</template>

<script>
import ShapeEditor from '@/components/ShapeEditor.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import SettingsPanel from '@/components/SettingsPanel.vue'

export default {
    components:{
    ShapeEditor, PreviewPanel, SettingsPanel  
        
    },
    data(){
        return {
            filename:'Untitled',
            previewMesh: null
        }        
    },
    methods:{
        previewUpdated(mesh){
            // console.log('Received mesh');
            // console.log(mesh);
            this.previewMesh = mesh;
        }
    }
    
}
</script>

<style>
.editor {
    padding: 24px;
    /* display: flex; */
    /* flex-grow: 1; */
}
.preview_panel {
    flex-grow: 1;
    /* height: 300px; */
}
.settings-panel {
    flex-grow: 1;
}
.shape-panel {
    flex-grow: 1;
}
</style>
