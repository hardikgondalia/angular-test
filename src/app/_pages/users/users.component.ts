import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatTableDataSource, MatTableDataSourcePaginator, MatTableModule } from '@angular/material/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, HttpClientModule, MatIconModule, MatExpansionModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent implements OnInit {
  dataSource: MatTableDataSource<user, MatTableDataSourcePaginator> = new MatTableDataSource();
  columnsToDisplay = ['action', 'firstName', 'phone', 'weight', 'companyName'];
  expandedElement = '';
  firstName: String = '';
  weight: Number | String = 0;
  phone: String = '';
  companyName: String = ''
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.userData();
  }
  userData() {
    this.getUser().subscribe(res => {
      res.users.forEach((element: user) => {
        element.loading = false;
      });
      this.dataSource = new MatTableDataSource(res.users)
    })
  }
  getUser(): Observable<userData> {
    return this.http.get<userData>(`https://dummyjson.com/users`)
  }
  updateUser(element: user) {
    return this.http.put(`https://dummyjson.com/users/${element.id}`, JSON.stringify({
      firstName: this.firstName,
      phone: this.phone,
      weight: this.weight,
      company: {
        name: this.companyName
      },
    }))
  }
  saveData(element: user) {
    element.loading = true;
    this.updateUser(element).subscribe(res => {
      element.loading = false;
      this.expandedElement = 'collapsed';
      this.userData()
    })

  }
  cancelUserUpdate() {
    this.expandedElement = 'collapsed';
  }
  elementValue(element: user) {
    if (this.expandedElement == null) {
      this.firstName = '';
      this.phone = '';
      this.weight = 0;
      this.companyName = ''
    }
    else {
      this.firstName = element.firstName;
      this.phone = element.phone;
      this.weight = element.weight;
      this.companyName = element.company.name
    }

  }
}
export interface userData {
  users: user[]
}
export interface user {
  id: Number;
  firstName: String;
  phone: String;
  weight: Number;
  loading: Boolean
  company: {
    name: String;
  },

}
