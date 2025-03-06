import { Component } from '@angular/core';

interface Notification{
  title: string;
  seen: boolean;
  date: Date;
  content: string;
  day: string;
}

@Component({
  selector: 'app-notification',
  templateUrl: 'notification.page.html',
  styleUrls: ['notification.page.scss'],
  standalone: false,
})
export class NotificationPage {
  isSeen(notification: Notification): string {
    if(notification.seen){
      return 'seen';
    }
    return 'not-seen';
  }
  notifications: Notification[] = [
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: false,
      date: new Date(5, 6, 2025),
      content: "ipsam, quod, quibusdam, quia voluptas, voluptatem, quos, doloremque",
      day:  "Today",
    },
    {
      title: "Notification Title",
      seen: true,
      date: new Date(),
      content: "Notification Content",
      day: "Today",
    }
  ];
  getDay(date: Date): string {
    if(date.toDateString() === new Date().toDateString()){
      return "Today";
    }
    if(date.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()){
      return "Yesterday";
    }
    return date.toDateString();
  }
  constructor() { }

}
