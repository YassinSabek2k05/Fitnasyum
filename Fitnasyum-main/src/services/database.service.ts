import { Injectable, signal, WritableSignal } from "@angular/core";
import { CapacitorSQLite,SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";

const DB_USERS = 'users';

export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})

export class DatabaseService {
    private sqlite: SQLiteConnection = new SQLiteConnection('CapacitorSQLite');
    private db!: SQLiteDBConnection;
    private user: WritableSignal<User[]> = signal<User[]>([]);
    constructor() {

    }
    
}