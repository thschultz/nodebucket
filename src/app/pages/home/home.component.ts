// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from 'src/app/shared/task.service';
import { Message } from 'primeng/api/message';
import { Employee } from '../../shared/models/employee.interface';
import { Item } from '../../shared/models/item.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //setting variables
  serverMessages: Message[] = [];
  employee: Employee;
  todo: Item[];
  done: Item[];
  empId: number;
  newTaskId: string;
  newTaskMessage: string;
  //taskForm validator. min length is 3, max length is 35 characters, input is required
  taskForm: FormGroup = this.fb.group({
    task: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder, private dialog: MatDialog) {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee = {} as Employee;
    this.newTaskId = ''
    this.todo = [];
    this.done = [];
    this.newTaskMessage = ''

    //finding tasks for set empId
    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        this.employee = res;
        console.log('--Employee Data--')
        console.log(this.employee);
      },
      error: (err) => {
        console.log(err.message);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      },
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        console.log('--ToDo and Done Data--')
        console.log(this.todo);
        console.log(this.done);
      }
    })
  }

  ngOnInit(): void {
  }
  //creating task function and adds it
  createTask() {
    const newTask = this.taskForm.controls['task'].value;

    this.taskService.createTasks(this.empId, newTask).subscribe({
      next: (res) => {
        this.newTaskId = res.data.id
        this.newTaskMessage = res.message
        console.log('newTaskId:', this.newTaskId)

      },
      error: (err) => {
        console.log(err.message);
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      },
      //if successful, successful box will show. if not, it will you tell you the error
      complete: () => {
        let task = {
          _id: this.newTaskId,
          text: newTask
        } as Item
        this.todo.push(task)

        this.newTaskId = ''

        this.taskForm.controls['task'].setErrors({ 'incorrect': false })

        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: this.newTaskMessage
          }
        ]

      }
    })
  }
  //deleting tasks function
  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Task Dialog',
        body: 'Are you sure you want to delete this task?'
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'confirm') {
          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {

              this.todo = this.todo.filter(task => task._id !== taskId)
              this.done = this.done.filter(task => task._id !== taskId)

              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Task Deleted Successfully'
                }
              ]

            },
            error: (error) =>
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: error.message
                }
              ]
          })
        } else {
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info',
              detail: 'Deletion canceled'
            }
          ]
        }
      }
    })
  }
  //updating tasks function
  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res) => {
        this.todo = todo
        this.done = done
      },
      error: (err) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      }
    })
  }
  //drag and drop functionality.
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      console.log('Reordered task in the existing list');

      this.updateTaskList(this.empId, this.todo, this.done)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )

      console.log('Moved task item to new container')

      this.updateTaskList(this.empId, this.todo, this.done)
    }
  }
}



