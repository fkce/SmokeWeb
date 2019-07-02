import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import * as THREE from 'three-full';
import { ObstService } from 'src/app/services/obst/obst.service';
import { split, forEach, map } from 'lodash';
import { Result, HttpManagerService } from 'src/app/services/http-manager/http-manager.service';

@Component({
  selector: 'app-smokeview',
  templateUrl: './smokeview.component.html',
  styleUrls: ['./smokeview.component.scss']
})
export class SmokeviewComponent implements OnInit {

  @ViewChild('smokeview') smokeview: ElementRef;

  renderer = new THREE.WebGLRenderer();
  scene = null;
  camera = null;
  controls = null;
  light = null
  //mesh = null;
  axesHelper = null;
  canvasWidth = null;
  canvasHeight = null;

  textXb: string = "";

  bufferObsts = null;
  geometry: any;

  tree: object = {};

  constructor(
    private obstServiece: ObstService,
    private httpManager: HttpManagerService
  ) {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x22262b);

    this.axesHelper = new THREE.AxesHelper(1);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 2;
    this.camera.up = new THREE.Vector3(0, 0, 1);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;

    // Push obsts to buffer geometry
    this.bufferObsts = obstServiece.obsts(["0.2,5.0, 0.2,0.4, 0.0,3.0", "0.2,0.4, 0.4,5.0, 0.0,3.0"])

    //var geometry = new THREE.BufferGeometry();
    ////var material = new THREE.MeshBasicMaterial({ color: 'rgb(120, 0, 0)' });
    ////material.side = THREE.DoubleSide;

    var verticesArray = [0.15625, 0.15625, 0.0, 0.34375, 0.15625, 0.0, 0.34375, 0.34375, 0.0, 0.15625, 0.34375, 0.0,
      0.15625, 0.15625, 0.03125, 0.34375, 0.15625, 0.03125, 0.34375, 0.34375, 0.03125, 0.15625, 0.34375, 0.03125,
      0.15625, 0.15625, 0.0, 0.34375, 0.15625, 0.0, 0.34375, 0.34375, 0.0, 0.15625, 0.34375, 0.0,
      0.15625, 0.15625, 0.03125, 0.34375, 0.15625, 0.03125, 0.34375, 0.34375, 0.03125, 0.15625, 0.34375, 0.03125,
      0.15625, 0.15625, 0.0, 0.34375, 0.15625, 0.0, 0.34375, 0.34375, 0.0, 0.15625, 0.34375, 0.0,
      0.15625, 0.15625, 0.03125, 0.34375, 0.15625, 0.03125, 0.34375, 0.34375, 0.03125, 0.15625, 0.34375, 0.03125,
      0.1875, 0.25, 0.125, 0.3125, 0.25, 0.125, 0.3125, 0.40625, 0.125, 0.1875, 0.40625, 0.125,
      0.1875, 0.25, 0.25, 0.3125, 0.25, 0.25, 0.3125, 0.40625, 0.25, 0.1875, 0.40625, 0.25,
      0.1875, 0.25, 0.125, 0.3125, 0.25, 0.125, 0.3125, 0.40625, 0.125, 0.1875, 0.40625, 0.125,
      0.1875, 0.25, 0.25, 0.3125, 0.25, 0.25, 0.3125, 0.40625, 0.25, 0.1875, 0.40625, 0.25,
      0.1875, 0.25, 0.125, 0.3125, 0.25, 0.125, 0.3125, 0.40625, 0.125, 0.1875, 0.40625, 0.125,
      0.1875, 0.25, 0.25, 0.3125, 0.25, 0.25, 0.3125, 0.40625, 0.25, 0.1875, 0.40625, 0.25,
      0.09375, 0.09375, 0.375, 0.40625, 0.09375, 0.375, 0.40625, 0.40625, 0.375, 0.09375, 0.40625, 0.375,
      0.09375, 0.09375, 0.5, 0.40625, 0.09375, 0.5, 0.40625, 0.40625, 0.5, 0.09375, 0.40625, 0.5,
      0.09375, 0.09375, 0.375, 0.40625, 0.09375, 0.375, 0.40625, 0.40625, 0.375, 0.09375, 0.40625, 0.375,
      0.09375, 0.09375, 0.5, 0.40625, 0.09375, 0.5, 0.40625, 0.40625, 0.5, 0.09375, 0.40625, 0.5,
      0.09375, 0.09375, 0.375, 0.40625, 0.09375, 0.375, 0.40625, 0.40625, 0.375, 0.09375, 0.40625, 0.375,
      0.09375, 0.09375, 0.5, 0.40625, 0.09375, 0.5, 0.40625, 0.40625, 0.5, 0.09375, 0.40625, 0.5,
      0.09375, 0.09375, 0.125, 0.1875, 0.09375, 0.125, 0.1875, 0.40625, 0.125, 0.09375, 0.40625, 0.125,
      0.09375, 0.09375, 0.25, 0.1875, 0.09375, 0.25, 0.1875, 0.40625, 0.25, 0.09375, 0.40625, 0.25,
      0.09375, 0.09375, 0.125, 0.1875, 0.09375, 0.125, 0.1875, 0.40625, 0.125, 0.09375, 0.40625, 0.125,
      0.09375, 0.09375, 0.25, 0.1875, 0.09375, 0.25, 0.1875, 0.40625, 0.25, 0.09375, 0.40625, 0.25,
      0.09375, 0.09375, 0.125, 0.1875, 0.09375, 0.125, 0.1875, 0.40625, 0.125, 0.09375, 0.40625, 0.125,
      0.09375, 0.09375, 0.25, 0.1875, 0.09375, 0.25, 0.1875, 0.40625, 0.25, 0.09375, 0.40625, 0.25,
      0.3125, 0.09375, 0.125, 0.40625, 0.09375, 0.125, 0.40625, 0.40625, 0.125, 0.3125, 0.40625, 0.125,
      0.3125, 0.09375, 0.25, 0.40625, 0.09375, 0.25, 0.40625, 0.40625, 0.25, 0.3125, 0.40625, 0.25,
      0.3125, 0.09375, 0.125, 0.40625, 0.09375, 0.125, 0.40625, 0.40625, 0.125, 0.3125, 0.40625, 0.125,
      0.3125, 0.09375, 0.25, 0.40625, 0.09375, 0.25, 0.40625, 0.40625, 0.25, 0.3125, 0.40625, 0.25,
      0.3125, 0.09375, 0.125, 0.40625, 0.09375, 0.125, 0.40625, 0.40625, 0.125, 0.3125, 0.40625, 0.125,
      0.3125, 0.09375, 0.25, 0.40625, 0.09375, 0.25, 0.40625, 0.40625, 0.25, 0.3125, 0.40625, 0.25];
    var vertices = new Float32Array(verticesArray);

    var indicesArray = [0, 1, 5, 0, 5, 4, 2, 3, 7, 2, 7, 6, 9, 10, 14, 9, 14, 13, 11, 8, 12, 11, 12, 15,
      20, 21, 22, 20, 22, 23, 16, 18, 17, 16, 19, 18, 24, 25, 29, 24, 29, 28, 26, 27, 31, 26, 31, 30,
      33, 34, 38, 33, 38, 37, 35, 32, 36, 35, 36, 39, 44, 45, 46, 44, 46, 47, 40, 42, 41, 40, 43, 42,
      48, 49, 53, 48, 53, 52, 50, 51, 55, 50, 55, 54, 57, 58, 62, 57, 62, 61, 59, 56, 60, 59, 60, 63,
      68, 69, 70, 68, 70, 71, 64, 66, 65, 64, 67, 66, 72, 73, 77, 72, 77, 76, 74, 75, 79, 74, 79, 78,
      81, 82, 86, 81, 86, 85, 83, 80, 84, 83, 84, 87, 92, 93, 94, 92, 94, 95, 88, 90, 89, 88, 91, 90,
      96, 97, 101, 96, 101, 100, 98, 99, 103, 98, 103, 102, 105, 106, 110, 105, 110, 109, 107, 104, 108, 107, 108, 111,
      116, 117, 118, 116, 118, 119, 112, 114, 113, 112, 115, 114];
    var indices = new Uint16Array(indicesArray);

    var normalsArray = [0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]
    var normals = new Float32Array(normalsArray);

    var colorsArray = [
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4, 1.0, 0.8, 0.4,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451,
      0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451, 0.59216, 0.37647, 0.3451]
    //var colors = new Float326Array(colorsArray);
    function times(n) {
      return n * 255;
    }
    colorsArray = map(colorsArray, times);

    function fragmentShader() {
      return `
        precision mediump float;
        precision mediump int;
        uniform float time;
        varying vec3 vPosition;
        varying vec4 vColor;
        void main()	{
          vec4 color = vec4( vColor );
          //color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
          gl_FragColor = color;
        }
      `
    }

    function vertexShader() {
      return `
        precision mediump float;
        precision mediump int;
        uniform mat4 modelViewMatrix; // optional
        uniform mat4 projectionMatrix; // optional
        attribute vec3 position;
        attribute vec4 color;
        varying vec3 vPosition;
        varying vec4 vColor;
        void main()	{
          vPosition = position;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    var colorAttribute = new THREE.Uint8BufferAttribute(colorsArray, 3);
    //var colorAttribute = new THREE.Uint8BufferAttribute(colors, 4); // if transparency
    this.geometry.addAttribute('color', colorAttribute);
    colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader

    this.geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // material
    var material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 }
      },
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
      side: THREE.DoubleSide,
      transparent: true
    });
    var mesh = new THREE.Mesh(this.geometry, material);

    //var mesh = new THREE.Mesh(geometry);
    //var helperVertices = new THREE.VertexNormalsHelper(mesh, 2, 0x00ff00, 1);


    this.scene.add(mesh);
    //this.scene.add(helperVertices);

    // Add created obsts
    //this.scene.add(this.bufferObsts);

    this.scene.add(this.axesHelper);

    this.resetCamera();
  }

  ngOnInit() {

    // Get directories structure from server
    this.httpManager.get('http://cloud.fkce.pl:3000/getDirectories').then(
      (result: Result) => {
        this.tree = result.data;
      },
      (error) => {
        if (isDevMode()) console.log(error);
      });


    // To remove
    this.textXb = "0.2,5.0, 0.2,0.4, 0.0,3.0\n0.2,0.4, 0.4,5.0, 0.0,3.0\n5.0,5.2, 0.2,5.0, 0.0,3.0"

  }

  ngAfterViewInit() {
    //console.log(this.smokeview);
    this.canvasHeight = this.smokeview.nativeElement.clientHeight;
    this.canvasWidth = this.smokeview.nativeElement.clientWidth;

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.camera.aspect = this.canvasWidth / this.canvasHeight;
    this.camera.updateProjectionMatrix();

    this.smokeview.nativeElement.appendChild(this.renderer.domElement);

    this.animate();
  }

  public updateView() {
    let xbs = split(this.textXb, '\n');
    this.scene.remove.apply(this.scene, this.scene.children);

    this.bufferObsts = this.obstServiece.obsts(xbs);
    this.resetCamera();
    this.scene.add(this.bufferObsts);
    this.scene.add(this.axesHelper);

    forEach(this.scene.children, (group) => {

      forEach(group.children, (mesh) => {
        mesh.material = new THREE.MeshNormalMaterial({ flatShading: true });
      });
    });

  }

  /**
   * Reset camera to bounding box center
   */
  public resetCamera() {
    //let boundingBox = new THREE.BoxHelper(this.bufferObsts);
    this.geometry.computeBoundingSphere();
    let boundingBox = this.geometry.boundingSphere;
    console.log(boundingBox);
    this.camera.position.x = boundingBox.center.x;
    this.camera.position.y = boundingBox.center.y;
    this.controls.target.set(boundingBox.center.x, boundingBox.center.y, boundingBox.center.z)
    this.controls.update();

  }

  /**
   * Animate
   */
  public animate() {
    window.requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

}
