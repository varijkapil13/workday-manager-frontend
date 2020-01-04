import {AbstractControl} from '@angular/forms';

export class ValidatePassword {
  static MatchPassword(abstractControl: AbstractControl) {
    const password = abstractControl.get('newPassword').value;
    const confirmPassword = abstractControl.get('repeatNewPassword').value;
    if (password !== confirmPassword) {
      abstractControl.get('repeatNewPassword').setErrors({
        MatchPassword: true
      });
    } else {
      return null;
    }
  }

}
