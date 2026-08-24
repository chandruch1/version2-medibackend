import axios from 'axios';

async function run() {
    try {
        const regRes = await axios.post("https://medibackup.onrender.com/patients/register", {
            patientName: "Test Patient",
            email: "test_temp_999@test.com",
            password: "password123",
            phone: "9999999999",
            dob: "1990-01-01",
            gender: "Male",
            age: 34,
            address: "123 Test",
            bloodGroup: "O+",
            disease: "None"
        });
        console.log("Registered");
    } catch (e) {
        console.log("Reg error", e.response?.data);
    }

    try {
        const loginRes = await axios.post("https://medibackup.onrender.com/patients/login", {
            email: "test_temp_999@test.com",
            password: "password123"
        });
        const token = loginRes.data.token;
        console.log("Logged in");

        const docsRes = await axios.get("https://medibackup.onrender.com/doctors/available", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Doctors:", JSON.stringify(docsRes.data.map(d => ({ name: d.doctorName, dob: d.dob, email: d.email })), null, 2));
    } catch (e) {
        console.log("Error", e.response?.data);
    }
}
run();
