const appointmentSchema = require("../models/appointmentModel");

const getAppointments = async(req,res) => {
    try{
        const appointments = await appointmentSchema.find().populate("doctorId","name-_id");
        res.status(200).json({
            message:"Getting Appointments",
            data:appointments
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const getAppointmentsById = async(req,res) => {
    try{
        const {id} = req.params
        const appointments = await appointmentSchema.findById(id).populate("doctorId","name-_id");
        res.status(200).json({
            message:"Getting appointments by Id",
            data:appointments
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const createAppointments = async(req,res) => {
    try{
        const {doctorId,date,duration,appointmentType,patientName,notes} = req.body;
        const checkSlots = await appointmentSchema.findOne({doctorId,date});

        if(checkSlots){
            res.status(400).json({
                message:"Slot Already Booked"
            })
        }

        const appointment = await appointmentSchema.create({doctorId,date,duration,appointmentType,patientName,notes});

        res.status(201).json({
            message:"Appointment Created",
            data:appointment
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const editAppointments = async(req,res) => {
    try{
        const {id} = req.params;
        const {date,duration,appointmentType,patientName,notes} = req.body;

        const appointment = await appointmentSchema.findById(id);
        if(!appointment){
            res.status(404).json({
                message:"Appointment Not Found"
            })
        }

        const previousAppointment = await appointmentSchema.findOne({doctorId:appointment.doctorId,date});
        if(previousAppointment && previousAppointment._id.toString() !== id){
            res.status(400).json({
                message:"New Time Slot Already Booked"
            })
        }

        const updatedAppointment = await appointmentSchema.findByIdAndUpdate(id,{date,duration,appointmentType,patientName,notes},{new:true})

        res.status(201).json({
            message:"Updated Appointment",
            data:updatedAppointment
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const deleteAppointments = async(req,res) => {
    try{
        const {id} = req.params;
        const appointment = await appointmentSchema.findByIdAndDelete(id);
        res.status(404).json({
            message:"Appointment Deleted Successfully",
            data:appointment
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

module.exports = {
    getAppointments,
    getAppointmentsById,
    createAppointments,
    editAppointments,
    deleteAppointments
}