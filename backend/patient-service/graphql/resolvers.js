import { GraphQLDataSourceRequestKind } from "@apollo/gateway/dist/datasources/types.js";
import Patient from "../models/Patient.js";
import { GraphQLScalarType, Kind } from "graphql";

// DateTime scalar implementation
const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime scalar type',
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => new Date(ast.value)
});
const resolvers = {
  Patient: {
    __resolveReference:(patient, {datasources})=>{
      return datasources.patientAPI.getPatientById(patient.id);
    }
  },  DateTime,
  Query: {
    //all patients
    patients: async () => {
      try {
        const patients = await Patient.find();
        return patients.map((patient) => ({
          id: patient._id.toString(),

          ...patient.toObject(),
          createdAt: new Date(patient.createdAt).toISOString(),
          updatedAt: new Date(patient.updatedAt).toISOString(),
        }));
      } catch (error) {
        throw new Error("Error fetching patients: " + error.message);
      }
    },

    //patients by id
    patient: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return patient;
      } catch (error) {
        throw new Error("Error finding patient: " + error.message);
      }
    },
    symptoms: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        // Return only the symptoms from the patient's physical data
        return patient.physicalData ? patient.physicalData.symptoms : [];
      } catch (error) {
        throw new Error("Error fetching symptoms: " + error.message);
      }
    },

    contactDetails: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return {
          contactInfo: patient.contactInfo,
          emergencyContact: patient.emergencyContact,
        };
      } catch (error) {
        throw new Error("Error fetching contact details: " + error.message);
      }
    },
    healthDetails: async (_, { id }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }
        return {
          medicalHistory: patient.medicalHistory,
          physicalData: patient.physicalData,
          visits: patient.visits,
        };
      } catch (error) {
        throw new Error("Error fetching health details: " + error.message);
      }
    },
  },

  Mutation: {
    addPatient: async (_, args) => {
      try {
        const patient = new Patient(args);
        const newPatient = await patient.save();
        return { id: newPatient._id.toString(), ...newPatient.toObject() };
      } catch (error) {
        console.log(`Server-Error creating patient: ${error}`);
        throw new Error("Server-Error creating patient: " + error.message);
      }
    },

    deletePatient: async (_, { id }) => {
      try {
        // Find the patient by ID and delete it
        const patient = await Patient.findByIdAndDelete(id);

        if (!patient) {
          throw new Error("Patient not found");
        }

        // Return a success message
        return "Patient deleted successfully";
      } catch (error) {
        throw new Error("Error deleting patient: " + error.message);
      }
    },

    updatePatient: async (_, { id, contactInfo }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Server - Patient not found");
        }

        if (!patient) {
          throw new Error("Patient not found");
        }

        if (contactInfo) {
          patient.contactInfo = {
            ...patient.contactInfo,
            ...contactInfo,
          };
        }

        await patient.save();
        return patient;
      } catch (error) {
        throw new Error("Server - Error updating patient: " + error.message);
      }
    },

    addVisit: async (_, { id, visit }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        patient.visits.push(visit);
        await patient.save();

        return {
          id: patient._id.toString(),
          createdAt: new Date(patient.createdAt).toISOString(),
          updatedAt: new Date(patient.updatedAt).toISOString(),
          ...patient.toObject(),
        };
      } catch (error) {
        throw new Error("Error adding visit: " + error.message);
      }
    },

    // Add symptoms to an existing patient's physical data
    addSymptoms: async (_, { id, symptoms }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        // Add the symptoms to the patient's physical data
        patient.physicalData.symptoms = [
          ...patient.physicalData.symptoms,
          ...symptoms,
        ];

        await patient.save();

        return patient;
      } catch (error) {
        throw new Error("Error adding symptoms: " + error.message);
      }
    },

    removeSymptom: async (_, { id, symptom }) => {
      try {
        const patient = await Patient.findById(id);
        if (!patient) {
          throw new Error("Patient not found");
        }

        // Remove symptom if it exists in the array
        patient.physicalData.symptoms = patient.physicalData.symptoms.filter(
          (s) => s !== symptom
        );

        await patient.save();
        return patient;
      } catch (error) {
        throw new Error("Error removing symptom: " + error.message);
      }
    },
  },
};

export default resolvers;
