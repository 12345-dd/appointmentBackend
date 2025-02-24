const doctorSchema = require("../models/doctorModel");
const appointmentSchema = require("../models/appointmentModel");
const { parseISO, isBefore, addMinutes, format } = require("date-fns");

const getAllDoctors = async(req,res) => {
    try{
        const doctors = await doctorSchema.find();
        if(doctors){
            res.status(200).json({
                message:"Getting All Doctors Successfully",
                data:doctors
            })
        } else {
            res.status(404).json({
                message:"Error in getting doctors data",
                data:[]
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const getDoctorSlots = async(req,res) => {
    try{
        const {id} = req.params;
        const {date} = req.query;

        const doctor = await doctorSchema.findById(id)
        if(!doctor){
            res.status(404).json({
                message:"Doctor Not Found"
            })
        }

        const startTime = parseISO(`${date}T${doctor.workingHours.start}`);
        const endTime = parseISO(`${date}T${doctor.workingHours.end}`);

        const appointments = await appointmentSchema.find({doctorId:id,date:{$gte:startTime,$lt:endTime}});

        let slots = [];
        let time = startTime;

        while(isBefore(time,endTime)){
            if(!appointments.some((app)=>app.date.getTime() === time.getTime())){
                slots.push(format(time,"HH:mm"));
            }
            time = addMinutes(time,30)
        }

        res.status(200).json({
            message:"Available slots",
            slots:slots
        })
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

module.exports = {
    getAllDoctors,
    getDoctorSlots
}