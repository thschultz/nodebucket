// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../shared/models/item.interface';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  //find all tasks path
  findAllTasks(empId: number): Observable<any> {
    return this.http.get(`/api/employees/${empId}/tasks`)
  }
  //create tasks path
  createTasks(empId: number, task: string): Observable<any> {
    return this.http.post(`/api/employees/${empId}/tasks`, {
      text: task
    })
  }
  //update tasks path
  updateTask(empId: number, todo: Item[], done: Item[]): Observable<any> {
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      done
    })
  }
  //delete tasks path
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`)
  }
}
