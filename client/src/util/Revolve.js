/**
 * Based on https://codepen.io/zachernuk/pen/BNjZdP
 * Revolve a number of points creating a mesh with given subdivisions
 * @param THREE the Three.js object
 * @param pts An Array of Vector3
 * @param segments Number of subdivided segnments
 */
const revolve = (THREE, pts,segments) => {
	var geo = new THREE.Geometry();

	var edges = [];


	for(var s = 0;s<segments;s++) {
		var theta = s/segments*Math.PI*2;
		var rx = Math.cos(theta);
		var rz = -Math.sin(theta);
		var edge = [];
		for(var i =0;i<pts.length;i++) {
			var v3 = new THREE.Vector3(pts[i].x*rx, pts[i].y, pts[i].x*rz);
			geo.vertices.push(v3);
			edge.push(v3);
		}
		edges.push(edge);
	}

	for(var p = 0;p<pts.length-1;p++) {
		for(var i =0;i<segments;i++) {
		
			var side1= edges[i];
			var side2 = edges[(i+1)%segments];
			//I want a,b,c,d.
			var a = geo.vertices.indexOf(side1[p]);
			var b = geo.vertices.indexOf(side1[p+1]);
			
			var c = geo.vertices.indexOf(side2[p]);
			var d = geo.vertices.indexOf(side2[p+1]);
			if(a==-1||b==-1||c==-1||d==-1) {
				debugger;
			}
			
			var face1 = new THREE.Face3(c,b,a);
			var face2 = new THREE.Face3(b,c,d);
			geo.faces.push(face1,face2);
		}
	}

	geo.mergeVertices();
	geo.computeFaceNormals();
	geo.computeVertexNormals();
	geo.computeBoundingSphere();

	return geo;
}
export default {
    revolve
}