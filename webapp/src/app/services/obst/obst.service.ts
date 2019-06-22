import { Injectable } from '@angular/core';
import * as THREE from 'three-full';
import { split, toNumber, ThrottleSettings, forEach } from 'lodash';

interface IXb {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  z1: number;
  z2: number;
}

@Injectable({
  providedIn: 'root'
})
export class ObstService {

  //private matSimple = new THREE.MeshBasicMaterial({ color: 0x20a380 });
  //private matSimple = new THREE.MeshNormalMaterial({ flatShading: true });
  private matSimple = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending });

  constructor() { }

  /**
   * Description ...
   * @param xbs 
   * @param type 
   */
  public obsts(xbs?: string[], type?: string): THREE.Group {

    let obstGroup = new THREE.Group();

    forEach(xbs, (xb) => {
      let obst = this.box(xb);
      obstGroup.add(obst);
    });

    return obstGroup;
  }

  /**
   * Generate and posiotion THREE mesh
   * @param xb Obst XB parameter
   */
  public box(string: string): THREE.Mesh {

    let xb = this.setXb(string);
    let obstGeom = new THREE.BoxGeometry(xb.x2 - xb.x1, xb.y2 - xb.y1, xb.z2 - xb.z1);
    // Create mesh
    let mesh = new THREE.Mesh(obstGeom, this.matSimple);

    // Box position is center by default, so we have to move it
    let x1 = xb.x1 + (xb.x2 - xb.x1) / 2;
    let y1 = xb.y1 + (xb.y2 - xb.y1) / 2;
    let z1 = xb.z1 + (xb.z2 - xb.z1) / 2;

    // Set posiotion
    mesh.position.x = x1;
    mesh.position.y = y1;
    mesh.position.z = z1;

    return mesh
  }

  /**
   * Description ...
   * @param string XB string
   */
  public setXb(string: string): IXb {
    let xbArray = split(string, ',');
    let xb: IXb = {
      x1: toNumber(xbArray[0]),
      x2: toNumber(xbArray[1]),
      y1: toNumber(xbArray[2]),
      y2: toNumber(xbArray[3]),
      z1: toNumber(xbArray[4]),
      z2: toNumber(xbArray[5])
    }
    return xb;
  }
}
