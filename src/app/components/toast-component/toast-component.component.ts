import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';

export enum ToastType {
  info,
  success,
  warning,
  error
}


@Component({
  selector: 'app-toast-component',
  templateUrl: './toast-component.component.html',
  styleUrls: ['./toast-component.component.css']
})
export class ToastComponentComponent implements OnInit {


  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  @ViewChild('toastComponent', {static: false})
  private toastObj: ToastComponent;

  constructor() {
  }

  private static generateToast(type: ToastType, title: string, message: string) {
    const toast = {title, content: message, cssClass: 'e-toast-info', icon: 'e-info toast-icons'};
    switch (type) {
      case ToastType.info:
        return {...toast, cssClass: 'e-toast-info', icon: 'e-info toast-icons'};
      case ToastType.success:
        return {...toast, cssClass: 'e-toast-success', icon: 'e-success toast-icons'};
      case ToastType.warning:
        return {...toast, cssClass: 'e-toast-warning', icon: 'e-warning toast-icons'};
      case ToastType.error:
        return {...toast, cssClass: 'e-toast-danger', icon: 'e-error toast-icons'};

    }
  }

  ngOnInit() {

  }

  public showToast(type: ToastType, title: string, message: string) {
    setTimeout(() => {
      this.toastObj.show(ToastComponentComponent.generateToast(type, title, message));
    }, 500);
  }

  onClick() {
    this.toastObj.hide('All');
  }

  beforeOpen() {
    this.toastObj.target = document.body;
  }
}
