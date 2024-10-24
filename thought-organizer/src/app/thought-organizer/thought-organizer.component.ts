import { Component, ElementRef, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThoughtService } from '../thought.service'; 
import { Router } from '@angular/router';
import * as d3 from 'd3';

export interface ThoughtNode {
  id: string;
  text: string;
  children: ThoughtNode[];
  linkedNodes?: ThoughtNode[];
} 
@Component({
  selector: 'app-thought-organizer',
  templateUrl: './thought-organizer.component.html',
  styleUrls: ['./thought-organizer.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ThoughtOrganizerComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  private rootNode: ThoughtNode = { id: 'root', text: 'Root Thought', children: [] };
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width = 800;
  private height = 600;
  private linkingSourceNode: ThoughtNode | null = null;

  selectedNode: ThoughtNode | null = null;
  actionBoxPosition: { x: number; y: number } | null = null;
  actionType: string | null = null;
  inputValue: string = '';

  constructor(private thoughtService: ThoughtService, private router: Router) {}
  

  ngOnInit() {
    this.createSvg();
    this.loadApplicationState(); 
    document.addEventListener('click', this.handleClickOutside); 
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside); 
  }

  private createSvg() {
    this.svg = d3.select(this.svgContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private renderTree(data: ThoughtNode) {
    this.svg.selectAll('*').remove(); 

    const treeLayout = d3.tree<ThoughtNode>().size([this.height, this.width - 200]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    this.svg.selectAll('line.link')
      .data(root.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d: d3.HierarchyLink<ThoughtNode>) => d.source.y ?? 0)
      .attr('y1', (d: d3.HierarchyLink<ThoughtNode>) => d.source.x ?? 0)
      .attr('x2', (d: d3.HierarchyLink<ThoughtNode>) => d.target.y ?? 0)
      .attr('y2', (d: d3.HierarchyLink<ThoughtNode>) => d.target.x ?? 0)
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    this.drawLinkedNodeConnections(root);

    const nodes = this.svg.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: d3.HierarchyNode<ThoughtNode>) => `translate(${d.y ?? 0}, ${d.x ?? 0})`)
      .on('click', (event: MouseEvent, d: d3.HierarchyNode<ThoughtNode>) => {
        event.stopPropagation();
        this.handleNodeClick(d.data, event);
      });

    nodes.append('circle')
      .attr('r', 10)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    nodes.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: d3.HierarchyNode<ThoughtNode>) => d.children ? -12 : 12)
      .attr('text-anchor', (d: d3.HierarchyNode<ThoughtNode>) => d.children ? 'end' : 'start')
      .text((d: d3.HierarchyNode<ThoughtNode>) => d.data.text);
  }
  private loadApplicationState() {
    this.thoughtService.getApplicationState().subscribe(
      (data: any) =>  {
        if (data) {
          this.rootNode = data;
          this.renderTree(this.rootNode);
        } else {
          this.saveApplicationState();
        }
      },
      (error: any) => { 
        console.error('Error fetching state:', error);
      }
    );
  }
 
  private saveApplicationState() {
    this.thoughtService.saveApplicationState(this.rootNode).subscribe(
      () => {
        console.log('Application state saved successfully.');
      },
      (error: any) => { 
        console.error('Error saving state:', error);
      }
    );
  }
  private handleNodeClick(node: ThoughtNode, event: MouseEvent) {
    if (this.linkingSourceNode) {
      this.completeLinkingProcess(node);
    } else {
      this.selectedNode = node; 
      this.actionBoxPosition = { x: event.clientX + 10, y: event.clientY + 10 }; 
      this.actionType = null; 
    }
  }

  performAction(action: string) {
    this.actionType = action;

    if (action === 'link' && this.selectedNode) {
      this.initiateLinking(this.selectedNode);
      this.actionBoxPosition = null;
    }

    if (this.selectedNode && action === 'edit') {
      this.inputValue = this.selectedNode.text;
    }
  }

  submitAction() {
    if (this.actionType === 'add') {
      this.addThought(this.selectedNode!);
    } else if (this.actionType === 'edit') {
      this.editThought(this.selectedNode!);
    } else if (this.actionType === 'delete') {
      this.deleteThought(this.selectedNode!);
    } else if (this.actionType === 'link') {
      this.initiateLinking(this.selectedNode!);
    }
    
    this.inputValue = '';
    this.selectedNode = null;
    this.actionBoxPosition = null;
    this.actionType = null;

    this.saveApplicationState(); 
  }

  closeActionBox() {
    this.selectedNode = null;
    this.actionBoxPosition = null;
    this.actionType = null;
  }

  private addThought(node: ThoughtNode) {
    if (this.inputValue) {
      const newNode: ThoughtNode = { id: (Math.random() * 1000).toString(), text: this.inputValue, children: [] };
      node.children.push(newNode);
      this.renderTree(this.rootNode);
      this.saveApplicationState();
    }
  }

  private editThought(node: ThoughtNode) {
    if (this.inputValue) {
      node.text = this.inputValue;
      this.renderTree(this.rootNode);
      this.saveApplicationState();
    }
  }

  private deleteThought(node: ThoughtNode) {
    this.removeNode(this.rootNode, node.id);
    this.renderTree(this.rootNode);
    this.saveApplicationState();
  }

  private removeNode(parent: ThoughtNode, nodeId: string): boolean {
    const index = parent.children.findIndex(child => child.id === nodeId);
    if (index !== -1) {
      parent.children.splice(index, 1);
      return true;
    }

    for (const child of parent.children) {
      if (this.removeNode(child, nodeId)) {
        return true;
      }
    }

    return false;
  }

  private initiateLinking(sourceNode: ThoughtNode) {
    this.linkingSourceNode = sourceNode; 
  }

  private completeLinkingProcess(targetNode: ThoughtNode) {
    if (this.linkingSourceNode && this.linkingSourceNode !== targetNode) {
      if (!this.linkingSourceNode.linkedNodes) {
        this.linkingSourceNode.linkedNodes = [];
      }

      if (!this.linkingSourceNode.linkedNodes.includes(targetNode)) {
        this.linkingSourceNode.linkedNodes.push(targetNode);
      } else {
        alert('These nodes are already linked.');
      }
      this.linkingSourceNode = null; 
      this.renderTree(this.rootNode); 
      this.saveApplicationState(); 
    } else {
      alert('Cannot link a node to itself. Please select a different node.');
      this.linkingSourceNode = null; 
    }
  }

  private handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (this.actionBoxPosition && !target.closest('.action-box')) {
      this.closeActionBox();
    }
  };

  private drawLinkedNodeConnections(root: d3.HierarchyNode<ThoughtNode>) {
    const linkedNodes = root.descendants().filter(d => d.data.linkedNodes && d.data.linkedNodes.length > 0);
    linkedNodes.forEach((node) => {
      node.data.linkedNodes?.forEach((linkedNode) => {
        const targetNode = root.descendants().find(d => d.data.id === linkedNode.id);
        if (targetNode) {
          this.svg.append('line')
            .attr('x1', node.y ?? 0)
            .attr('y1', node.x ?? 0)
            .attr('x2', targetNode.y ?? 0)
            .attr('y2', targetNode.x ?? 0)
            .attr('stroke', '#999')
            .attr('stroke-dasharray', '5,5')
            .attr('stroke-width', 1.5);
        }
      });
    });
  }
  logout() {
    this.router.navigate(['/']);
  }
}



