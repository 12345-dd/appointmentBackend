const doctorSchema = require("../models/doctorModel");
const appointmentSchema = require("../models/appointmentModel");
const { parseISO, isBefore, addMinutes, format } = require("date-fns");
const tz = require("date-fns-tz");
const utcToZonedTime = tz.toZonedTime;

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

const getDoctorSlots = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        const doctor = await doctorSchema.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }

        const startTime = parseISO(`${date}T${doctor.workingHours.start}`);
        const endTime = parseISO(`${date}T${doctor.workingHours.end}`);
        const timeZone = "Asia/Kolkata"; 

        const appointments = await appointmentSchema.find({
            doctorId: id,
            date: { $gte: startTime, $lt: endTime }
        });

        let bookedSlots = appointments.map(app => {
            const istTime = utcToZonedTime(app.date, timeZone); 
            return format(istTime, "HH:mm"); 
        });

        bookedSlots = [...new Set(bookedSlots)];

        let slots = [];
        let time = startTime;

        while (isBefore(time, endTime)) {
            let slotTime = format(utcToZonedTime(time, timeZone), "HH:mm"); 
            slots.push(slotTime);
            time = addMinutes(time, 30);
        }

        console.log("Backend - Available Slots (IST):", slots);
        console.log("Backend - Booked Slots (IST):", bookedSlots); 

        return res.status(200).json({ message: "Available slots", slots, bookedSlots });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};




module.exports = {
    getAllDoctors,
    getDoctorSlots
}