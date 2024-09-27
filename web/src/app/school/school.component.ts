import { Component, OnInit } from '@angular/core';
import { SchoolService} from "../../service/school.service";
import { HttpClient } from '@angular/common/http';
import { Confirm } from 'notiflix';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  school = {
    name: ''
  };
  // 定义学校数组
  schools: any[];

  constructor(private schoolService: SchoolService,
              private httpClient: HttpClient) { }

  ngOnInit() {
    this.fetchSchools();
  }

  fetchSchools() {
    this.schoolService.getList().subscribe(
      (data) => {
        this.schools = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  onDelete(school_id: number): void {
    if (confirm('确认要删除这所学校？')) {
      console.log(school_id);
      const Data = {
        school_id: school_id
      };
      console.log(Data);
      this.schoolService.deleteSchool(school_id).subscribe({
        next: () => {
          this.schools = this.schools.filter(s => s.school_id !== school_id);
          console.log(this.schools);
        },
        error: (error) => {
          console.error('删除失败', error);
          alert('删除失败操作');
        }
      });
    }
  }
}