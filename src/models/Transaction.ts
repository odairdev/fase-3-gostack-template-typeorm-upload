import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import Category from './Category';

@Entity('transactions')
class Transaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @ManyToOne(() => Category, category => category.transaction, {eager: true})
  @JoinColumn({name: 'category_id'})
  category: string

  @OneToMany(() => Transaction, transaction => transaction.category)
  category_id: string;

  created_at: Date;

  updated_at: Date;
}

export default Transaction;
