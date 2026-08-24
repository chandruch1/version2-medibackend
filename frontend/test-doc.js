import axios from 'axios';

async function run() {
    try {
        const loginRes = await axios.post("https://medibackup.onrender.com/doctors/login", {
            email: "sarah.jenkins@hospital.com",
            password: "Dr.1998"
        });
        console.log("Logged in successfully!", loginRes.data.doctorName);
    } catch (e) {
        console.log("Login Error", e.response?.data || e.message);
    }
}
run();
