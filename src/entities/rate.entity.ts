import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int2", { nullable: false })
  from: number;

  @Column("int2", { nullable: false })
  to: number;

  @Column("int2", { nullable: false })
  rate: number;

  @Column("int2")
  percentage: number;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;
}
