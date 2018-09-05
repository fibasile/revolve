<template>
<div class="preview-wrapper"> 
<h2 class="is-size-7 has-text-weight-light has-text-left">Preview</h2>
<div class="preview-gl" ref="previewPanel">
</div>
</div>
</template>
<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

export default {
    data() {
        return {
          wireframe: true,
          camera: null,
          scene: null,
          renderer: null,
          mesh: null,
          gridHelper: null,
          controls: null
        }
      },
    mounted(){
        this.init();
        this.animate();
        this.$nextTick(function(){
            window.addEventListener('resize', this.handleResize);
        })
    },
    beforeDestroy(){
        window.removeEventListener('resize',this);
    },
    methods: {
        handleResize(){
            this.$nextTick(function(){
                let container = this.$refs.previewPanel; 
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientWidth*.75);
            })
        },
        init: function() {
            let container = this.$refs.previewPanel; // document.getElementById('shape-editor');
    
            this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
            this.camera.position.z = 1;
           

    
            this.scene = new THREE.Scene();
    
            let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            let material = new THREE.MeshNormalMaterial();
    
            this.mesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.mesh);

            const size = 1;
            const divisions = 10;
            
            this.gridHelper = new THREE.GridHelper( size, divisions );
            this.gridHelper.position.y = -.3;
            this.scene.add( this.gridHelper );

            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setClearColor(new THREE.Color(1.0,1.0,1.0),1.0);
            this.renderer.setSize(container.clientWidth, container.clientWidth*.75);
            
            this.controls = new OrbitControls( this.camera, this.renderer.domElement);
            this.controls.update();
            
            container.appendChild(this.renderer.domElement);
        },
        animate: function() {
            requestAnimationFrame(this.animate);
            // this.mesh.rotation.x += 0.01;
            this.mesh.material.wireframe = this.wireframe;
            this.mesh.rotation.y += 0.02;
        	this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
  },
}
</script>
<style>
.preview-wrapper {
    // border: 1px solid blue;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}
.preview-gl {
    // border: 1px solid red;
    min-height: 250px;
    flex-grow: 1;
}
</style>
