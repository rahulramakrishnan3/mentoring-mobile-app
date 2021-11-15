import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { urlConstants } from 'src/app/core/constants/urlConstants';
import {
  HttpService,
  LoaderService,
  LocalStorageService,
  ToastService,
} from 'src/app/core/services';
import { CommonRoutes } from 'src/global.routes';
import { localKeys } from '../../constants/localStorage.keys';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private httpService: HttpService,
    private loaderService: LoaderService,
    private router: Router,
    private toast: ToastService,
    private localStorage: LocalStorageService,
  ) { }
  async profileUpdate(formData) {
    await this.loaderService.startLoader();
    const config = {
      url: urlConstants.API_URLS.PROFILE_UPDATE,
      payload: formData,
    };
    try {
      let data: any = await this.httpService.post(config);
      let userDetails = await this.localStorage.getLocalData(localKeys.USER_DETAILS);
      userDetails.user= data.user;
      await this.localStorage.setLocalData(localKeys.USER_DETAILS, userDetails);
      this.loaderService.stopLoader();
      this.router.navigate([CommonRoutes.TABS + '/' + CommonRoutes.PROFILE], { queryParams: formData });
      this.toast.showToast(data.message, "success");
    }
    catch (error) {
      this.loaderService.stopLoader();
    }
  }
  async getProfileDetailsAPI() {
    const config = {
      url: urlConstants.API_URLS.PROFILE_DETAILS,
      payload: {}
    };
    try {
      let data: any = await this.httpService.get(config);
      return data;
    }
    catch (error) {
    }
  }

  async profileDetails(): Promise<any> {
    await this.loaderService.startLoader();
    return new Promise((resolve) => {
      try {
      this.localStorage.getLocalData(localKeys.USER_DETAILS)
        .then(async (data) => {
          if (data?.user?.about) {
            this.loaderService.stopLoader();
            resolve(data);
          } else {
            var res = await this.getProfileDetailsAPI();
            let response = _.get(res, 'result');
            data.user = response;
            await this.localStorage.setLocalData(localKeys.USER_DETAILS, data);
            this.loaderService.stopLoader();
            resolve(data);
          }
        })
      } catch (error) {
        this.loaderService.stopLoader();
      }
    });
  }

  async generateOtp(formData) {
    await this.loaderService.startLoader();
    const config = {
      url: urlConstants.API_URLS.GENERATE_OTP,
      payload: formData
    };
    try {
      let data: any = await this.httpService.post(config);
      this.loaderService.stopLoader();
      this.toast.showToast(data.message, "success");
      return data;
    }
    catch (error) {
      this.loaderService.stopLoader();
    }
  }
  async updatePassword(formData) {
    await this.loaderService.startLoader();
    const config = {
      url: urlConstants.API_URLS.RESET_PASSWORD,
      payload: formData
    };
    try {
      let data: any = await this.httpService.post(config);
      this.loaderService.stopLoader();
      this.toast.showToast(data.message, "success");
      return data;
    }
    catch (error) {
      this.loaderService.stopLoader();
    }
  }
}
