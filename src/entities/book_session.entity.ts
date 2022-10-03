import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Auto } from "./auto.entity";

@Entity()
export class Book_session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  //@ManyToOne(() => Auto, (auto) => auto.book_sessions)
  auto_id: number;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;

  @Column({ nullable: false, default: 0 })
  total: number;
}
