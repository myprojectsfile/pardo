import { Component, OnInit } from '@angular/core';
import { DockerService } from './docker.service';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-docker',
  templateUrl: './docker.component.html',
  styleUrls: ['./docker.component.css']
})


export class DockerComponent implements OnInit {
  image: string;
  tag: string;
  loading: boolean = false;
  message: string = 'ایمیج و تک مورد نظر را انتخاب کنید';
  socket;
  downloadQueue = [];
  constructor(private dockerService: DockerService) {
    this.socket = io(environment.hostIP);
  }

  ngOnInit() {
    this.socket.on('docker-queue-changed', (data) => {
      this.downloadQueue = data;
      console.log(data);
    });
  }

  downlodDockerImage() {
    this.loading = true;
    this.message = ' درحال ارسال درخواست دانلودایمیج ' + this.image + ':' + this.tag;
    this.dockerService.downlodDockerImage(this.image, this.tag)
      .subscribe(
        resutl => {
          this.message = ' ایمیج ' + this.image + ':' + this.tag + '  با موفقیت به لیست دانلود افزوده شد  ';
          this.loading = false;
        },
        error => {
          this.message = error;
          this.loading = false;
        });;
  }
}
