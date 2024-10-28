import { Component, ElementRef, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThoughtService } from '../thought.service'; 
import { Router } from '@angular/router';
import * as d3 from 'd3';

export interface ThoughtNode {
  id: string;
  text: string;
  username: string;
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
  private rootNode: ThoughtNode = { id: 'root', text: 'Root Thought', username: '', children: [] };
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

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.router.navigate(['/']); 
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
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (username && token) {
      this.thoughtService.getApplicationState(username, token).subscribe( // Now includes token
        (data: ThoughtNode) => {
          if (data) {
            this.rootNode = data;
            this.renderTree(this.rootNode);
          } else {
            this.saveApplicationState(username);
          }
        },
        (error: any) => {
          console.error('Error fetching state:', error);
        }
      );
    } else {
      console.warn('No username found in localStorage. Redirecting to login.');
      this.router.navigate(['/']);
    }
  }
   
  private saveApplicationState(username: string) {
    const token = localStorage.getItem('token');
    if (token) {
      this.thoughtService.saveApplicationState(this.rootNode, token).subscribe(
        () => {
          console.log('Application state saved successfully.');
        },
        (error: any) => {
          console.error('Error saving state:', error);
        }
      );
    } else {
      console.error('No token found for saving application state.');
    }
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

    this.saveApplicationState(this.rootNode.username);
  }

  closeActionBox() {
    this.selectedNode = null;
    this.actionBoxPosition = null;
    this.actionType = null;
  }

  private addThought(node: ThoughtNode) {
    if (this.inputValue) {
      const newNode: ThoughtNode = { id: (Math.random() * 1000).toString(), text: this.inputValue, username: this.rootNode.username, children: [] };
      node.children.push(newNode);
      this.renderTree(this.rootNode);
      this.saveApplicationState(this.rootNode.username);
    }
  }

  private editThought(node: ThoughtNode) {
    if (this.inputValue) {
      node.text = this.inputValue;
      this.renderTree(this.rootNode);
      this.saveApplicationState(this.rootNode.username);
    }
  }

  private deleteThought(node: ThoughtNode) {
    const index = this.rootNode.children.indexOf(node);
    if (index > -1) {
      this.rootNode.children.splice(index, 1);
      this.renderTree(this.rootNode);
      this.saveApplicationState(this.rootNode.username);
    }
  }

  private initiateLinking(node: ThoughtNode) {
    this.linkingSourceNode = node;
    this.actionBoxPosition = null;
  }

  private completeLinkingProcess(targetNode: ThoughtNode) {
    if (this.linkingSourceNode) {
      this.linkingSourceNode.linkedNodes = this.linkingSourceNode.linkedNodes || [];
      this.linkingSourceNode.linkedNodes.push(targetNode);
      this.renderTree(this.rootNode);
      this.linkingSourceNode = null;
      this.saveApplicationState(this.rootNode.username);
    }
  }

  private drawLinkedNodeConnections(root: d3.HierarchyNode<ThoughtNode>) {
    root.descendants().forEach(linkedNode => {
      const targetNode = root.descendants().find(n => n.data.id === linkedNode.id);
      if (targetNode) {
        this.svg.append('line')
          .attr('class', 'link')
          .attr('x1', root.y ?? 0)
          .attr('y1', root.x ?? 0)
          .attr('x2', targetNode.y ?? 0)
          .attr('y2', targetNode.x ?? 0)
          .attr('stroke', '#ff0000')
          .attr('stroke-width', 2);
      }
    });
  }

  private handleClickOutside = (event: MouseEvent) => {
    if (this.actionBoxPosition && !this.isInsideActionBox(event)) {
      this.closeActionBox();
    }
  }

  private isInsideActionBox(event: MouseEvent): boolean {
    const actionBox = document.querySelector('.action-box');
    return actionBox ? actionBox.contains(event.target as Node) : false;
  }
}
