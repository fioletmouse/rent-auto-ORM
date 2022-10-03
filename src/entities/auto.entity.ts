import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Book_session } from "./book_session.entity";

@Entity()
export class Auto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  auto_name: string;

  @OneToMany(() => Book_session, (bookSession) => bookSession.auto_id)
  book_sessions: Book_session[];
}
