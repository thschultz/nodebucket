// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {
  sessionName: string

  year: number

  constructor(private cookieService: CookieService, private router: Router) {
    this.sessionName = this.cookieService.get('session_name')
    this.year = Date.now()
  }

  ngOnInit(): void {
  }
  //logout function.
  logout() {
    this.cookieService.deleteAll()
    this.router.navigate(['/session/login'])
  }
}
