import Employee from "../models/employeeSchema.js";

export const addEmployee = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized! No valid user ID." });
        }
        const refUserId = req.user.id;
        const { name, userName, email, phoneNumber, dob, address, department, position, salary } = req.body;

        const existingEmployee = await Employee.findOne({
            $or: [{ userName }, { email }]
        });

        if (existingEmployee) {
            return res.status(400).json({ message: "Username Email already exists!" });
        }

        const newEmployee = new Employee({
            refUserId,
            name,
            userName,
            email,
            phoneNumber,
            dob,
            address,
            department,
            position,
            salary,
        });

        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully!", employee: newEmployee });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};

export const getEmployees = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const refUserId = req.user.id;
        const employees = await Employee.find({ refUserId });
        res.status(200).json(employees);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized! No valid user ID." });
        }

        const refUserId = req.user.id;
        const { id } = req.params;
        const { name, userName, email, phoneNumber, dob, address, department, position, salary } = req.body;

        const existingEmployee = await Employee.findOne({ _id: id, refUserId });
        if (!existingEmployee) {
            return res.status(404).json({ message: "Employee not found!" });
        }
        const updatedEmployee = await Employee.findByIdAndUpdate(id, { name, userName, email, phoneNumber, dob, address, department, position, salary }, { new: true });
        res.status(200).json({ message: "Employee updated successfully!", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
};

export const deleteOneEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }
        res.status(200).json({ message: "Employee deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting employee!", error });

    }
}

export const deleteManyEmployee = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No employee IDs provided!" });
        }
        await Employee.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Selected employees deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employees!", error });
    }
}