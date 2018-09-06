<template>
<div id="shape-wrapper">
    <h2 class="is-size-7 has-text-weight-light has-text-left">Shape editor</h2>
    <div id="shape-editor" ref="shapeEditor">
    </div>
</div>
</template>
<script>
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import DragControls from "../util/DragControls";
import TransformControls from "../util/TransformControls";
import Revolve from "../util/Revolve";

const ARC_SEGMENTS = 50;

export default {
    props: [
        "previewUpdated"
    ],
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      spotlight: null,
      handles: [],
      curve: null,
      curveMirror: null,
      dragcontrols: null,
      transformcontrols: null,
      planeHelper: null,
      previewMaterial: new THREE.MeshToonMaterial({color: 0xffccff}),
      previewMesh: null,
      positions: [
        //   new THREE.Vector3(0,-100,0),
          new THREE.Vector3(-30,-100, 0),
          new THREE.Vector3(-70,-50, 0),
          new THREE.Vector3(-85,0, 0),
          new THREE.Vector3(-75,50, 0),
          new THREE.Vector3(-30,100, 0),
          new THREE.Vector3(-20,150, 0),
          new THREE.Vector3(-30,200, 0),
          new THREE.Vector3(-25,250, 0),
        //   new THREE.Vector3(0,255, 0)
      ]
    };
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted() {
    // console.log('mounted')
    this.$nextTick(function() {
        this.initScene();
    this.animate();
      // console.log('event listener added');
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeDestroy() {
    // console.log('event listener remove');
    if (this.previewTimer){
            clearTimeout(this.previewTimer)
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize(e) {
      // console.log('resize event' + this);
      this.$nextTick(function() {
        let container = this.$refs.shapeEditor; // document.getElementById('shape-editor');
        // this.camera.aspect = container.clientWidth / container.clientWidth*0.75;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
          container.clientWidth,
          container.clientWidth * 0.75
        );
        
      });
    },
    initScene() {
      let container = this.$refs.shapeEditor; // document.getElementById('shape-editor');
      this.camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight*.75,
        1,
        10000
      );

        const w = container.clientWidth;
        const h = container.clientWidth * .75;
        // this.camera = new THREE.OrthographicCamera(
        //     w / -2, w/2, h/2, h/-2, 2000
        // );


      this.camera.aspect = w/h;
      this.camera.position.set(0, 0, 1000);


      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      // this.renderer.setClearColor(new THREE.Color(1.0,1.0,1.0),1.0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        container.clientWidth,
        container.clientWidth * 0.75
      );
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);

      this.initHelpers();
      this.initLights();
      this.initGeometry();
      this.initControls();

      this.handleResize();

    },
    
    initHelpers() {
      var helper = new THREE.GridHelper(2000, 50);
      helper.rotateX(-Math.PI / 2.0);
      helper.position.y = 0;
      helper.position.z = 0;
      helper.material.opacity = 0.25;
      helper.material.transparent = true;
      this.scene.add(helper);
      this.planeHelper = helper;
    },

    initCurve(){

        // 
        // var curve = new THREE.CatmullRomCurve3( this.positions, false, 'catmullrom', 0.5 );
        // curve.curveType = 'catmullrom';

        // var points = curve.getPoints( ARC_SEGMENTS ); 
        // points.unshift(new THREE.Vector3(0, points[0].y, 0))
        // points.push(new THREE.Vector3(0,points[points.length-1].y,0 ) )

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( (ARC_SEGMENTS+2)*3), 3) );

        var material = new THREE.LineBasicMaterial( { color : 0x000000 , linewidth: 2 } );
        // Create the final object to add to the scene
        this.curve = new THREE.Line( geometry, material );
        this.scene.add(this.curve);

// var mirrorPoints = points.map((p)=>{
        //     return p.reflect(new THREE.Vector3(1,0,0));  
        // })
        var mirrorGeometry = new THREE.BufferGeometry();
        mirrorGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( (ARC_SEGMENTS+2)*3), 3) );
        var mirrorMaterial = new THREE.LineDashedMaterial( { color : 0x999999 , linewidth: 2 } );
        this.curveMirror = new THREE.Line( mirrorGeometry, mirrorMaterial);

        this.scene.add(this.curveMirror);

        this.updateCurve(true);

 

    },
    initHandlers() {
      
      this.positions.forEach(pos => {
            var object = this.handlerFactory(pos)
            this.scene.add(object);
            this.handles.push(object);
      });
    },
    handlerFactory(pos) {
    //   const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
      const geometry = new THREE.CircleBufferGeometry( 10, 32 );
      const material = new THREE.MeshToonMaterial({
        color: 0xffcc00
      });
      material.wireframe = false;
      const object = new THREE.Mesh(geometry, material);
      object.position.x = pos.x;
      object.position.y = pos.y;
      object.position.z = 0;
      object.castShadow = true;
      object.receiveShadow = true;
      return object;
    },
    initGeometry() {
      var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
      planeGeometry.rotateX(-Math.PI);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      this.scene.add(plane);

      this.initHandlers();
      this.initCurve();
    },
    initLights() {
      this.scene.add(new THREE.AmbientLight(0xf0f0f0));

      const light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(0, 1500, 500);
      light.castShadow = true;
      light.shadow = new THREE.LightShadow(
        new THREE.PerspectiveCamera(70, 1, 200, 2000)
      );
      light.shadow.bias = -0.000222;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      // 			this.scene.add( light );

      this.spotlight = light;
    },
    initControls() {
        var vm = this;
        
        this.transformcontrols  = new TransformControls( this.camera,  this.renderer.domElement );
        this.transformcontrols.showZ = false;
		this.transformcontrols.addEventListener( 'change', function(e){
                //   vm.updateCurve();
        } );
        this.scene.add(  this.transformcontrols  );

        this.transformcontrols.addEventListener( 'objectChange', function( e ) {
			 vm.updateCurve();
        });

        this.dragcontrols = new DragControls( this.handles, this.camera, this.renderer.domElement ); //
        this.dragcontrols.enabled = false;
        this.dragcontrols.addEventListener( 'hoveron', function ( event ) {
            // transformControl.attach( event.object );
            // cancelHideTransorm();
            vm.transformcontrols.attach(event.object);
            // console.log('selected event object')
        } );
        this.dragcontrols.addEventListener( 'hoveroff', function ( event ) {
            vm.transformcontrols.detach(vm.transformcontrols.object);
            // console.log('deselected')
				vm.updateCurve(true);
        } );


                
    },
    updateCurve(preview){

              var min = 100000;
        this.handles.forEach((h)=>{
            if (h.position.y < min ) min = h.position.y;
        })
        if (this.planeHelper)
            this.planeHelper.position.y = min;
        // console.log(min)

        var splineMesh = this.curve;
        var mirrorMesh = this.curveMirror;
        var handlePositions = this.handles.map(h=> h.position)

        var curve = new THREE.CatmullRomCurve3( handlePositions, false, 'catmullrom', 0.5 );
        curve.curveType = 'catmullrom';
        
        var points =curve.getPoints( ARC_SEGMENTS );
        var startPoint = points[0]
        points.push(new THREE.Vector3(0,points[points.length-1].y, 0 ) )
        points.unshift(new THREE.Vector3(0, startPoint.y, 0))
        
        var position = splineMesh.geometry.attributes.position;
        for (var i=0; i<points.length; i++){
            position.setXYZ(i, points[i].x,points[i].y,points[i].z);
        }
        position.needsUpdate = true;
        
        var mirrorPoints = points.map((p)=>{
            return p.reflect(new THREE.Vector3(1,0,0));  
        })

        var position2 = mirrorMesh.geometry.attributes.position;

        for (var i=0; i<mirrorPoints.length; i++){
            position2.setXYZ(i, mirrorPoints[i].x,mirrorPoints[i].y,mirrorPoints[i].z);
        }
        position2.needsUpdate = true;

        // this.$nextTick(()=>{
            
        // })
        if (preview){
            this.updatePreview(points.map((v)=>{
                v.y += -this.planeHelper.position.y
                return v
            }), 32); 
        }
    },
    updatePreview(points, segments){
        var geometry = Revolve.revolve(THREE, points, segments);
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        var oldMesh = this.previewMesh;
        // if (oldMesh){
            // this.scene.remove(oldMesh);
            // oldMesh.dispose();
            // this.previewMesh.geometry.fromGeometry(bufferGeometry);
            // var geo = this.previewMesh.geometry;
            // geo.positions = bufferGeometry.positions;
            // geo.positionsNeedUpdate = true;
            // geo.vertices = geometry.vertices;
            // geo.faces = geometry.faces;
            // geo.verticesNeedUpdate = true;
            // geo.elementsNeedUpdate = true;
            // geo.mergeVertices();
            // geo.computeFaceNormals();
    	    // geo.computeBoundingSphere();
        // } 
        this.previewMesh = new THREE.Mesh( geometry, this.previewMaterial )
        // this.scene.add(this.previewMesh)
        
        // if (this.previewUpdated){
            this.$emit('previewUpdated',this.previewMesh)
        // }

    },
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
      this.renderer.render(this.scene, this.camera);
    },
    render(){
    }
  }
};
</script>
<style>
#shape-wrapper {
  /* border: 1px solid red; */
  display: flex;
  height: 100%;
  flex-direction: column;
}
#shape-editor {
  /* width: 100%;
  flex-grow: 1;*/
  min-height: 500px;
  flex-grow: 1;
  /* border: 1px solid yellow; */
  height: 100%;
}
</style>