export class EditProfileOptions{
    email : string;
    phone : string;
    address_line1 : string;
    address_line2 : string;
    address_line3 : string;
    zipcode : string
    
    constructor(email : string, phone : string, address_line1 : string, address_line2 : string, address_line3 : string, zipcode : string){
        this.email = email
        this.phone = phone
        this.address_line1 = address_line1
        this.address_line2 = address_line2
        this.address_line3 = address_line3
        this.zipcode = zipcode
    }
    }