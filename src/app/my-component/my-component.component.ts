import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormsModule } from '@angular/forms';

// This is the interface used to store our sample data to demostrate use of ngIf else
interface Participant {
  name: string;
  email: string;
}

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})

export class MyComponent implements OnInit {

  contestants: Participant[] = [];
  contestant: Participant;
  c: Participant;
  // Pattern to validate e-mail against
  emailPattern = "^[a-z0-9\_\.]+\@[a-z0-9][a-z0-9\-]{2,63}\.[a-z]{2,3}$";
  constructor() { }

  ngOnInit() {
    // Storing values in local so values don't disappear on page refresh
    if (localStorage.getItem("contestants")) {
      this.contestants = this.getContestants();
    }
    this.c = { name: "", email: "" };
  }

  // This function adds the form entry to storage
  addEntry(vals) {
    this.contestant = {
      name: vals.name,
      email: vals.email
    }
    this.contestants.unshift(this.contestant);
    localStorage.setItem("contestants", JSON.stringify(this.contestants));
    this.contestants = this.getContestants();
  }

  // Retrieves stored details
  getContestants() {
    this.contestants = JSON.parse(localStorage.getItem('contestants'));
    return this.contestants;
  }

}
