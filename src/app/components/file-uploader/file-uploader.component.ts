import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpRequest} from '@angular/common/http';
import {catchError, last, map, tap} from 'rxjs/operators';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class FileUploaderComponent implements OnInit {

  /** Link text */
  @Input() text = 'Upload Timely Report';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'reportFile';
  /** Target URL for file uploading. */
  @Input() target = ApiUrls.workdays;

  // File extension that accepted, same as 'accept' of <input type="file" />.By the default, it's set to 'image/*'.
  @Input() accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  // Allow you to add a handler after its completion. Bubble up response text from remote.
  @Output() complete = new EventEmitter<string>();

  currentlyLoggeedInUser: UserFromJwt;

  private files: Array<FileUploadModel> = [];

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {
    this.currentlyLoggeedInUser = this.authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);

    const req = new HttpRequest('POST', `${this.target}/${this.currentlyLoggeedInUser.id}/upload`, fd, {
      reportProgress: true
    });

    file.inProgress = true;
    file.sub = this.httpClient.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => {
      }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed with error: ${error.message}`);
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

}
