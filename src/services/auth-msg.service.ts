import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AuthMsgService {
    private subject = new Subject<boolean>();

    sendMessage(message: boolean) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<boolean> {
        return this.subject.asObservable();
    }
}