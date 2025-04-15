import express from "express";
import { addEmployee, deleteManyEmployee, deleteOneEmployee, getEmployees, updateEmployee } from "../controllers/employee.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post('/addEmployee', verifyToken, addEmployee);
router.get('/getEmployees', verifyToken, getEmployees);
router.put('/updateEmployee/:id',verifyToken,updateEmployee);
router.delete('/deleteOneEmployee/:id',verifyToken,deleteOneEmployee);
router.post('/deleteManyEmployee',verifyToken,deleteManyEmployee);
export default router;