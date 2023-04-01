// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
//components that are available to navigate to
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contact',
        component: ContactComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'notfound',
        component: NotfoundComponent
      }
    ]
  },
  //not found page routing
  {
    path: '**',
    redirectTo: 'session/notfound'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
