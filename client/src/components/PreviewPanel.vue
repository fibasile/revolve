<template>
<div class="preview-wrapper"> 
<div class="columns">
    <div class="column">
        <h2 class="is-size-7 has-text-weight-light has-text-left">Preview</h2>
    </div>
    <div class="column is-narrow">
        <button class="button is-small">Export</button>
    </div>
</div>
<div class="preview-gl" ref="previewPanel">
</div>
</div>
</template>
<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

export default {
    props: [
        'mesh'
    ],
    data() {
        return {
          wireframe: true,
          camera: null,
          scene: null,
          renderer: null,
          spotligth: null,
        //   mesh: null,
          previewMesh: null,
          gridHelper: null,
          controls: null,
          previewMaterial:  new THREE.MeshPhongMaterial(
                    {color:0xffffff,
                    shininess:3, 
                    specular:0xffffff})
        }
      },
    watch: {
        mesh(newVal,oldVal){
            // console.log('watcher')
            if (newVal === oldVal) return;
            this.updatePreview(newVal)
        }
    },
    mounted(){
        this.init();
        this.animate();
        if (this.mesh){
            this.updatePreview(this.mesh)
        }
        this.$nextTick(function(){
            window.addEventListener('resize', this.handleResize);
        })
    },
    beforeDestroy(){
        window.removeEventListener('resize',this);
        if (this.previewMesh){
            this.previewMesh.geometry.dispose()
        }
    },
    methods: {
        updatePreview(newVal){
            if (this.previewMesh){
                this.scene.remove(this.previewMesh)
                this.previewMesh.geometry.dispose()
            }
    
            this.previewMesh = new THREE.Mesh( newVal.geometry, this.previewMaterial );
            // this.previewMesh.material.wireframe = true;
            this.camera.lookAt(new THREE.Vector3(0,500,0));
            this.scene.add(this.previewMesh);
        },
        handleResize(){
            this.$nextTick(function(){
                let container = this.$refs.previewPanel; 
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.clientWidth, container.clientWidth*.75);
            })
        },
        init: function() {
            let container = this.$refs.previewPanel; // document.getElementById('shape-editor');
    
            this.camera = new THREE.PerspectiveCamera(50, container.clientWidth/(container.clientWidth*0.75), 20, 1500);
            this.camera.position.x = -600;
            this.camera.position.y = 150;
            this.camera.position.z = -600;
            this.camera.lookAt(new THREE.Vector3(0,500,0));

            this.scene = new THREE.Scene();
    
            // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            let material = new THREE.MeshNormalMaterial();
    
            // mesh = new THREE.Mesh(geometry, material);
            // this.scene.add(this.mesh);

            const size = 1000;
            const divisions = 10;
            
            this.gridHelper = new THREE.GridHelper( size, divisions , 0xbbbbbb,0xdedede);
            
            this.gridHelper.position.y = -.3;
            this.scene.add( this.gridHelper );

            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setClearColor(new THREE.Color(1.0,1.0,1.0),1.0);
            this.renderer.setSize(container.clientWidth, container.clientWidth*.75);
            
            this.controls = new OrbitControls( this.camera, this.renderer.domElement);
            this.controls.update();
            
            container.appendChild(this.renderer.domElement);

            this.initLights();
        },

            initLights() {
                this.scene.add(new THREE.AmbientLight(0xfa3f0f));

                const light = new THREE.SpotLight(0xffffff, .3);
                light.position.set(0, 500, -300);
                light.castShadow = true;
                light.shadow = new THREE.LightShadow(
                    new THREE.PerspectiveCamera(70, 1, 200, 2000)
                );
                light.shadow.bias = -0.000222;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                light.lookAt(new THREE.Vector3(0,0,0))
                this.scene.add( light );

                this.spotlight = light;

                var spotLightHelper = new THREE.SpotLightHelper( light, new THREE.Color(0xff0000,1.0) );
                this.scene.add( spotLightHelper );

        },
        updateSpotlight(){
            var orbitRadius = 300;
            var date = Date.now() * 0.0005;
            this.spotlight.position.set(
                Math.cos(date) * orbitRadius,
                500,
                Math.sin(date) * orbitRadius
            );
            this.spotlight.lookAt(new THREE.Vector3());
        },
        animate: function() {
            requestAnimationFrame(this.animate);
            this.updateSpotlight();
            // this.mesh.rotation.x += 0.01;
            // this.mesh.material.wireframe = this.wireframe;
            // this.mesh.rotation.y += 0.02;
        	this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }
  },
}
</script>
<style>
.preview-wrapper {
    /* // border: 1px solid blue; */
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}
.preview-gl {
    /* // border: 1px solid red; */
    /* min-height: 250px; */
    flex-grow: 1;
}
</style>
