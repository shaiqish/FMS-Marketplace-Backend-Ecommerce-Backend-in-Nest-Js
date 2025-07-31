import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column()
  alternatePhoneNumber: string;

  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  postalCode: string;
}
