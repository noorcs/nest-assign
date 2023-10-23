import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hash, compare } from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // Hash the password before inserting into the database
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  // Compare hashed password with plain text password
  async comparePassword(plainTextPassword: string): Promise<boolean> {
    return compare(plainTextPassword, this.password);
  }
}
