import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  auto_name: string;
}
