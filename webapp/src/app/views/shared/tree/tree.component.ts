import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, Renderer2, OnChanges, SimpleChanges, SimpleChange, isDevMode } from '@angular/core';
import { forEach, filter, split, includes } from 'lodash';
import { HttpManagerService, Result } from 'src/app/services/http-manager/http-manager.service';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreeComponent implements OnChanges, OnInit {

  @ViewChild('tree') private treeContainer: ElementRef;
  @Input() tree: any;

  hidden: boolean = true;
  l1: string = '';
  l2: string = '';
  l3: string = '';

  simpleTree: object = {};

  constructor(
    private renderer: Renderer2,
    private httpManager: HttpManagerService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.tree = changes.tree.currentValue;
    this.simpleTree = this.tree;
  }

  ngOnInit() {

  }

  public getSimGeometry(simulation: any) {
    console.log(simulation);
    // Get directories structure from server
    if (simulation.extension == '.smv') {
      this.httpManager.get(`http://cloud.fkce.pl:3000/getSimGeometry/${simulation.path}`).then(
        (result: Result) => {
          console.log(result.data);
          let obsts = split(result.data.toString(), '\r\n').filter(function(item) {
            return includes(item, '&OBST');
          });

          // Result data should be passed to service where geometry will be generated
          // Then some function to extract the xbs ...
          // Then push to three.js
          
          console.log(obsts);
          //this.tree = result.data;
        },
        (error) => {
          if (isDevMode()) console.log(error);
        });
    }
  }

  public setLevel1(level: string) {
    if (this.l1 == level) {
      this.l1 = '';
    }
    else {
      this.l1 = level;
    }
  }

  public setLevel2(level: string) {
    if (this.l2 == level) {
      this.l2 = '';
    }
    else {
      this.l2 = level;
    }
  }

  public setLevel3(level: string) {
    if (this.l3 == level) {
      this.l3 = '';
    }
    else {
      this.l3 = level;
    }
  }

}
