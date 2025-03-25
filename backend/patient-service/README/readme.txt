to add a patient follow this mutation example.
created date and updatedAt are excluded as they are managed by mongooose.
all fields are required at the moment. changes can be requested.
fields are using input types for abstraction, check !typeDefs.

//Operation section top part
mutation AddPatient
(
    $fullName: String!, 
    $dateOfBirth: String!, 
    $gender: String!, 
    $contactInfo: ContactInfoInput!, 
    $emergencyContact: EmergencyContactInput!, 
    $medicalHistory: MedicalHistoryInput!, 
    $physicalData: PhysicalDataInput!, 
    $visits: [VisitInput!]
) 
{
  addPatient
    (
    fullName: $fullName, 
    dateOfBirth: $dateOfBirth, 
    gender: $gender, 
    contactInfo: $contactInfo, 
    emergencyContact: $emergencyContact, 
    medicalHistory: $medicalHistory, 
    physicalData: $physicalData, 
    visits: $visits
    ) 
    {
    contactInfo             <----return data
    {                   
      address
      email
      phone
    }
  }
}

{ 
  "fullName": "Darshmeen Dhillon",
  "dateOfBirth": "2000-01-01",  
  "gender": "Male",
  "contactInfo": {
    "phone":"647-123-1234", 
    "email":"darsh.dhillon@live.com", 
    "address":"10 madison square"
    },  
  "emergencyContact": {
    "name":"g",
    "phone":"416-123-1234",
    "relation":"spouse"
    },
  "medicalHistory": {
    "allergies": ["Peanuts", "Penicillin"],
    "chronicIllnesses": ["Diabetes"],
    "currentMedications": ["Metformin"],
    "pastSurgeries":"none"
    },
  "physicalData": {
    "height": 175.5,
    "weight": 70.2,
    "bloodPressure": "120/80",
    "heartRate": 72,
    "bloodType": "O+",
    "symptoms": ["Fatigue", "Headache"]
},
  "visits": [
    {
      "date": "2025-03-01",
      "reason": "Routine checkup",
      "doctor": "Dr. Smith",
      "diagnosis":"Flu",
    },
    
  ]
}

//inputs in type defs overview.
reusable structures for passing data into mutations. 
    -beneficial in components , could have a component "contact info", 
    "physical data" and import them into one app.jsx

//example - fill out input and pass it to the mutation.
input ContactInfoInput {
  phone: String!
  email: String
  address: String
}

type Mutation {
  addPatient(
    fullName: String!
    dateOfBirth: String!
    gender: String!
    contactInfo: ContactInfoInput!
    physicalData: PhysicalDataInput!
  ): Patient!
}



TESTED
  mutations
    - add patient
    - deletePatient
    - updatePatient
    - getSymptoms
  queries
    - getPatientByID


KNOWN ISSUES:
  - Not fully Fine tuned 
  - possible issue, not using enhanced id, using default graphql id but it works.




By Documentation darshmeen dhillon