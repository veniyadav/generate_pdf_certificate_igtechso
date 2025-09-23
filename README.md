# Certificate Generation Project

//first install all moduls using 
npm i

// after that start server using 
npm run dev

# postman test 
- post request 
// call api with provided like test data 
http://localhost:3000/certificate-generate

// test - row data : 
{
  "registerId": "REG2025-001",
  "email": "veniprasad@example.com",
  "phone": "9876543210",
  "address": "Indore, Madhya Pradesh, India",
  "fullName": "Veniprasad Yadav",
  "dob": "1998-05-15",
  "gender": "Male",
  "bloodGroup": "B+",
  "dateTime": "2025-09-22 10:30 AM"
}

// after calling api you have received "certificateUrl" copy and past in browser, now cirtificate PDF showing

example : http://localhost:3000/assets/certificates/1758603211812_certificate.pdf