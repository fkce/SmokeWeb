import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, Renderer2 } from '@angular/core';
import { forEach } from 'lodash';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnInit {

  @ViewChild('tree') private treeContainer: ElementRef;
  @Input() tree: any;

  hidden: boolean = true;
  l1: string = "";
  l2: string = "";
  l3: string = "";

  simpleTree: object = {};

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    console.log(this.tree);
  }

  public setLevel1(level: string) {
    if (this.l1 == level) {
      this.l1 = "";
    }
    else {
      this.l1 = level;
    }
  }

  public setLevel2(level: string) {
    if (this.l2 == level) {
      this.l2 = "";
    }
    else {
      this.l2 = level;
    }
  }

  public setLevel3(level: string) {
    if (this.l3 == level) {
      this.l3 = "";
    }
    else {
      this.l3 = level;
    }
  }

  public setDirectories() {

    console.log(this.tree);
    this.simpleTree = this.tree;
  }

}
