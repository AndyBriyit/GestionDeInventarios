import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [
      AuthModule.forRoot({
        config: {
          authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_IzzI1JeXI',
          redirectUrl: 'https://staging.ds0vtdas85ecg.amplifyapp.com/inventory',
          clientId: 'eibr62etv3s45b55gd05hpihk',
          scope: 'email openid phone',
          responseType: 'code'
        },
      }),
    ],
    exports: [AuthModule],
  })
export class AuthConfigModule {}
