<template>
<div id="shape-wrapper">
    <h2 class="is-size-7 has-text-weight-light has-text-left">Shape editor</h2>
    <div id="shape-editor" ref="shapeEditor">
    </div>
</div>
</template>
<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import DragControls from '../util/DragControls'
import TransformControls from '../util/TransformControls'
export default {
    data() {
        return {
          camera: null,
          scene: null,
          renderer: null,
          mesh: null,
          spotlight: null,
        }
      },
             // bind event handlers to the `handleResize` method (defined below)
        ready: function () {
          window.addEventListener('resize', this.handleResize)
        },
        beforeDestroy: function () {
          window.removeEventListener('resize', this.handleResize)
        },
    methods: {
        handleResize: function(){
           let container = this.$refs.shapeEditor; // document.getElementById('shape-editor');
           this.camera.aspect = container.clientWidth/container.clientHeight;
           this.camera.updateProjectionMatrix();
           this.renderer.setSize( window.innerWidth, window.innerHeight );
        },
 
        initScene() {
            let container = this.$refs.shapeEditor; // document.getElementById('shape-editor');
    
            this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 1, 10000);
            this.camera.position.set( 0, 250, 1000 );

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xf0f0f0 );
            
            this.initLights();
            this.initGeometry();
            this.initHelpers();
          
            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            // this.renderer.setClearColor(new THREE.Color(1.0,1.0,1.0),1.0);
			this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.shadowMap.enabled = true;

				
            container.appendChild(this.renderer.domElement);
        },
        initHelpers(){
				var helper = new THREE.GridHelper( 2000, 100 );
				helper.position.y = - 199;
				helper.material.opacity = 0.25;
				helper.material.transparent = true;
				this.scene.add( helper );    
        },
        initGeometry(){
            var planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
			planeGeometry.rotateX( - Math.PI / 2 );
			var planeMaterial = new THREE.ShadowMaterial( { opacity: 0.2 } );
			var plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.position.y = -200;
			plane.receiveShadow = true;
			this.scene.add( plane );
            
        },
        initLights(){
        
            this.scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
		
			const light = new THREE.SpotLight( 0xffffff, 1.5 );
			light.position.set( 0, 1500, 200 );
			light.castShadow = true;
			light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 200, 2000 ) );
			light.shadow.bias = -0.000222;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;
// 			this.scene.add( light );
		
			this.spotlight = light;
        },
        animate: function() {
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene, this.camera);
        }
  },
  mounted() {
    this.initScene();
    this.animate()
  }
}
</script>
<style>
#shape-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}
#shape-editor {
    width: 100%;
    flex-grow: 1;
    height: 500px;
}
</style>