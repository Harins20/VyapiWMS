
class User {
    constructor(id, name, user_name,role_id, user_type, address, city, country, email, mobile_number) {
        this._id = id;
        this.name = name
        this.user_name = user_name
        this.role_id = role_id
        this.user_type = user_type
        this.address = address
        this.city = city
        this.country = country
        this.email = email
        this.mobile_number = mobile_number
    }
}
export default User