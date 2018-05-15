import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { DockerComponent } from './docker/docker.component';
import { ProductsComponent } from './products.component';
import { DockerService } from './docker/docker.service';
import { SocketService } from './docker/socket.service';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule
  ],
  declarations: [DockerComponent, ProductsComponent],
  providers: [DockerService, SocketService]
})
export class ProductsModule { }
