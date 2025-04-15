import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
    refUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    department: { type: String },
    position: { type: String },
    salary: { type: Number },
});
const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;