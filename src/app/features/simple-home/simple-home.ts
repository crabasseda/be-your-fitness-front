import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'simple-home',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './simple-home.html',
  styleUrl: './simple-home.css',
})
export class SimpleHome {}
