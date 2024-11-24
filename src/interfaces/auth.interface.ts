
export interface SignupInput {
    username: string;
    email: string;
    password: string;
    phone_number: string;
    profile_picture?:string
    country :string
}

export interface IcreateUser extends SignupInput{

}
