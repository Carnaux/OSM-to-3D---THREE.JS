let dataJson;

let points = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
scene.background = new THREE.Color("rgb(100,100,100)");

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
const element = document.getElementById("renderDOM");
element.appendChild( renderer.domElement );

var axesHelper = new THREE.AxesHelper( 500 );
scene.add( axesHelper );

let controls = new THREE.OrbitControls(camera, renderer.domElement);

// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.y = 1000;
camera.rotation.z = Math.PI/2;

var animate = function () {
    requestAnimationFrame( animate );

   
    controls.update();
    renderer.render( scene, camera );
};

animate();


function generatePoints(data){
    let result = [];
    for (let i=0 ; i < data.features.length ; i++){
        // if (data.features[i].properties.tags.building != undefined) {
          let geometryData = {
              pointArr: data.features[i].geometry.coordinates
          }
          result.push(geometryData);
        // }
    }
    

    let organizedArr = [];
    
    for (let i=0 ; i < result.length ; i++){
        for (let j=0 ; j < result[i].pointArr.length ; j++){
            if(result[i].pointArr[j].length > 2){
                for (let k=0 ;k < result[i].pointArr[j].length; k++){
                    organizedArr.push({
                    "latitude": result[i].pointArr[j][k][0],
                    "longitude": result[i].pointArr[j][k][1]});


                    
                    // let v = new THREE.Vector3(result[i].pointArr[j][k][0], 0, result[i].pointArr[j][k][1])
                    
                    // var dotGeometry = new THREE.Geometry();
                    // dotGeometry.vertices.push(v);
                    // var dotMaterial = new THREE.PointsMaterial({
                    // size: 1,
                    // sizeAttenuation: false
                    // });
                    // var dot = new THREE.Points(dotGeometry, dotMaterial);
                    // scene.add(dot);
                }
            }else{
                organizedArr.push({
                "latitude": result[i].pointArr[j][0],
                "longitude": result[i].pointArr[j][1]});

                
            }
        }
    }


    // const URL = 'https://api.open-elevation.com/api/v1/lookup';
    // const otheParams = {
    //     headers:{
    //         "content-type":"application/json; charset=UFT-8",
           
    //     },
    //     body: organizedArr,
    //     method: "POST"
    // }

    // fetch(URL, otheParams)
    //     .then(data=>{return data.json()})
    //     .then(res=>{console.log("res", res)})
    //     .catch(error=>{console.log(error)})
    


    for (let i=0 ; i < organizedArr.length ; i++){
        let v = new THREE.Vector3(organizedArr[i].latitude *100, 0, organizedArr[i].longitude *100);
        
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(v);
        var dotMaterial = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: false
        });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        dot.position.set(organizedArr[i].latitude , 0, organizedArr[i].longitude );
    }



    // let ver = [];
    // for (let i=0 ; i < organizedArr.length ; i++){
      
    //     if(organizedArr[i].latitude != undefined && organizedArr[i].longitude != undefined){
    //     ver.push(new THREE.Vector3(organizedArr[i].latitude *100, 0, organizedArr[i].longitude *100));
    //     console.log("ble");
    // }

    // }
    // const geometry = new THREE.ConvexGeometry( ver );
    // const material = new THREE.MeshBasicMaterial({
    //     color: "rgb(255,0,0)",
    //     side: THREE.DoubleSide
    // });
    // var cube = new THREE.Mesh( geometry, material );
   
    // scene.add( cube );

    
    // console.log(cube.position)

    console.log(organizedArr);
}



function onOSMLoad(e){
    let data = e.target.result;
    

    const parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data,"text/xml");
    dataJson = osmtogeojson(xmlDoc);
    generatePoints(dataJson);
    console.log(dataJson)
}


function onChooseFile(event, onLoadFileHandler) {
    if (typeof window.FileReader !== "function")
      throw "The file API isn't supported on this browser.";
    let input = event.target;
    if (!input) throw "The browser does not properly implement the event object";
    if (!input.files)
      throw "This browser does not support the `files` property of the file input.";
    if (!input.files[0]) return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
  }