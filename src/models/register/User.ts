export interface User {
  knownAs: string;
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  city: string;
  country: string;
  photo: BinaryType | null;
}
