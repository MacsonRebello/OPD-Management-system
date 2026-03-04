const db = require("../db");

// Book Appointment
exports.bookAppointment = (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;

    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if time slot is available
    const checkSql = "SELECT * FROM appointments WHERE doctor_id=? AND appointment_date=? AND appointment_time=? AND status != 'cancelled'";

    db.query(checkSql, [doctor_id, appointment_date, appointment_time], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error checking availability", error: err.message });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "Time slot not available" });
      }

      // Generate token number
      const tokenSql = "SELECT MAX(token_number) as max_token FROM appointments WHERE appointment_date=?";

      db.query(tokenSql, [appointment_date], (err, tokenResult) => {
        if (err) {
          return res.status(500).json({ message: "Error generating token", error: err.message });
        }

        const token_number = (tokenResult[0].max_token || 0) + 1;

        const insertSql = `INSERT INTO appointments 
        (patient_id, doctor_id, appointment_date, appointment_time, token_number, reason, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          insertSql,
          [patient_id, doctor_id, appointment_date, appointment_time, token_number, reason || null, "scheduled"],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: "Booking failed", error: err.message });
            }

            const appointment_id = result.insertId;

            // Insert into queue_status table
            const queueSql = `INSERT INTO queue_status 
            (appointment_id, position, estimated_wait_time)
            VALUES (?, ?, ?)`;

            // Calculate estimated wait time (15 minutes per patient)
            const estimated_wait_time = (token_number - 1) * 15;

            db.query(queueSql, [appointment_id, token_number, estimated_wait_time], (queueErr) => {
              if (queueErr) {
                console.error("Queue insert error:", queueErr);
                // Don't fail the appointment booking if queue insert fails
              }

              res.status(201).json({
                message: "Appointment booked successfully",
                appointment_id: appointment_id,
                token_number: token_number,
                appointment_date: appointment_date,
                appointment_time: appointment_time,
                estimated_wait_time: estimated_wait_time
              });
            });
          }
        );
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Available Time Slots
exports.getAvailableSlots = (req, res) => {
  try {
    const { doctor_id, appointment_date } = req.query;

    if (!doctor_id || !appointment_date) {
      return res.status(400).json({ message: "Doctor ID and date are required" });
    }

    const sql = `SELECT appointment_time FROM appointments 
                 WHERE doctor_id=? AND appointment_date=? AND status != 'cancelled'`;

    db.query(sql, [doctor_id, appointment_date], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching slots", error: err.message });
      }

      // Define working hours (9 AM to 5 PM with 30-min slots)
      const allSlots = generateTimeSlots("09:00", "17:00", 30);
      const bookedSlots = result.map(r => r.appointment_time);
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({
        date: appointment_date,
        available_slots: availableSlots,
        total_slots: allSlots.length,
        booked_count: bookedSlots.length
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Queue Status
exports.getQueueStatus = (req, res) => {
  try {
    const { doctor_id, appointment_date } = req.query;

    if (!doctor_id || !appointment_date) {
      return res.status(400).json({ message: "Doctor ID and date are required" });
    }

    const sql = `SELECT a.token_number, a.appointment_time, a.status, p.name, a.appointment_id
                 FROM appointments a
                 JOIN patients p ON a.patient_id = p.patient_id
                 WHERE a.doctor_id=? AND a.appointment_date=? AND a.status IN ('scheduled', 'in_progress')
                 ORDER BY a.token_number ASC`;

    db.query(sql, [doctor_id, appointment_date], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching queue", error: err.message });
      }

      res.json({
        doctor_id: doctor_id,
        date: appointment_date,
        queue_count: result.length,
        patients: result
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel Appointment
exports.cancelAppointment = (req, res) => {
  try {
    const appointment_id = req.params.appointment_id;

    const sql = "UPDATE appointments SET status='cancelled' WHERE appointment_id=?";

    db.query(sql, [appointment_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Cancellation failed", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json({ message: "Appointment cancelled successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0);
  
  const end = new Date();
  end.setHours(endHour, endMin, 0);

  while (current < end) {
    const hours = String(current.getHours()).padStart(2, "0");
    const minutes = String(current.getMinutes()).padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}
