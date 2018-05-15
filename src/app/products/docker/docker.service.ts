import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable()
export class DockerService {

  constructor(private httpClient: HttpClient) { }

  downlodDockerImage(image: string, tag: string) {
    var body = { 'image': image, 'tag': tag };
    // var apiUrl = 'http://localhost:3000/api/docker/downloadImage';
    var apiUrl = environment.hostIP + '/api/docker/downloadImage';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // ,'Authorization': 'my-auth-token'
      })
    };

    return this.httpClient.post<Response>(apiUrl, body, httpOptions);
  }
}
