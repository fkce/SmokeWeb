import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import * as THREE from 'three-full';
import { ObstService } from 'src/app/services/obst/obst.service';
import { split, forEach } from 'lodash';
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

  tree: object = {};

  constructor(
    private obstServiece: ObstService,
    private httpManager: HttpManagerService
  ) {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x22262b);

    this.axesHelper = new THREE.AxesHelper(1);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 20;
    this.camera.up = new THREE.Vector3(0, 0, 1);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;

    // Push obsts to buffer geometry
    this.bufferObsts = obstServiece.obsts(["0.2,5.0, 0.2,0.4, 0.0,3.0", "0.2,0.4, 0.4,5.0, 0.0,3.0"])
    this.resetCamera();

    // Add created obsts
    this.scene.add(this.bufferObsts);

    this.scene.add(this.axesHelper);
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
    let boundingBox = new THREE.BoxHelper(this.bufferObsts);
    this.camera.position.x = boundingBox.geometry.boundingSphere.center.x;
    this.camera.position.y = boundingBox.geometry.boundingSphere.center.y;
    this.controls.target.set(boundingBox.geometry.boundingSphere.center.x, boundingBox.geometry.boundingSphere.center.y, boundingBox.geometry.boundingSphere.center.z)
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
