# Revolve

Using revolve you can quickly draw profiles and turn them into object you can
3D print.

Revolve takes 2D shapes and transforms them into 3D models. You adjust the control
points and watch in realtime the model take shape.

## Using Revolve

### File selection panel

In this window you can select an existing model, including the built-in examples 
available in the `Examples` folder.

You can also start a new design from scratch selecting the `New design` button.

### Design Editor

This tool allows you to customize the shape and build your 3D model.

The interface is split into three panels:

- Drawing panel: you can see a representation of the object profile, which
  defines the shape that will be revolved into a 3D object
- Model preview panel: this panel allows you to preview and interact the model,
  rotating and zooming. A more detailed version of this panel is in the Model preview mode.
- Settings panel: this panel contains all the configuration settings used to generate
  your object. 

### Model preview

This view allows to preview and export your model in bitmap or mesh format.

Select the `Take snapshot` button to export and image in PNG format. Set the desired resolution
in the `Image Options` dialog. 

Export your design to STL using the `Export STL` button.

## Running the server

1) Open `server.js` and start the app by clicking on the "Run" button in the top menu.

2) Alternatively you can launch the app from the Terminal:

    $ node server.js

Once the server is running, open the project in the shape of 'https://projectname-username.c9users.io/'. As you enter your name, watch the Users list (on the left) update. Once you press Enter or Send, the message is shared with all connected clients.


### References

- [Three.js Spline Editor](https://threejs.org/examples/#webgl_geometry_spline_editor)
- [WebGL Pieces using Revolve](https://codepen.io/zachernuk/pen/BNjZdP)
- [Three.js Curve](https://threejs.org/docs/#api/en/extras/core/Curve)
- [Three.js SplineCurve](https://threejs.org/docs/#api/en/extras/curves/SplineCurve)# revolve
