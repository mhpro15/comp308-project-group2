import { GraphQLScalarType, Kind } from 'graphql';
import Nurse from '../models/Nurse.js';


// Custom DateTime scalar resolver
const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Custom scalar type for DateTime values',
  serialize(value) {
    // Convert outgoing Date to ISO string
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    // Convert incoming value to Date
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

const resolvers = {
    DateTime,
 Patient:{
    __resolveReference:(patient, {datasources})=>{
      return datasources.patientAPI.getPatientById(patient.id);
    },
},
Nurse: {
    assignedPatients: async (nurse, _, { dataSources }) => {
      return nurse.assignedPatients.map(async assignment => ({
        ...assignment,
        patient: await dataSources.patientAPI.getPatientById(assignment.patientId),
      }));
    },
  },
 
  
  Query: {
    // Get all nurses
    nurses: async () => {
      try {
        return await Nurse.find();
      } catch (err) {
        throw new Error('Error fetching nurses: ' + err.message);
      }
    },
    // Get nurse by ID
    nurse: async (_, { id }) => {
      try {
        const nurse = await Nurse.findById(id);
        if (!nurse) throw new Error('Nurse not found');
        return nurse;
      } catch (err) {
        throw new Error('Error fetching nurse: ' + err.message);
      }
    },
        nurse: async (_, { id }) => {
          try {
            const nurse = await Nurse.findById(id)
              .populate({
                path: "assignedPatients.patientId",
                // Optionally, select only the fields you need from the Patient document:
                select: "fullName dateOfBirth gender contactInfo emergencyContact medicalHistory physicalData visits createdAt updatedAt"
              });
            if (!nurse) throw new Error("Nurse not found");
            return nurse;
          } catch (error) {
            throw new Error("Error fetching nurse: " + error.message);
          }
        },
      
   

    // Get nurses by specialization
    nursesBySpecialization: async (_, { specialization }) => {
      try {
        return await Nurse.find({ specialization });
      } catch (err) {
        throw new Error('Error fetching nurses by specialization: ' + err.message);
      }
    },
    // Get nurses available on a specific day and shift
    nursesByAvailability: async (_, { day, shift }) => {
      try {
        // Assumes workSchedule.days is an array of WeekDay values
        return await Nurse.find({
          "workSchedule.days": day,
          "workSchedule.shift": shift
        });
      } catch (err) {
        throw new Error('Error fetching nurses by availability: ' + err.message);
      }
    },
    // Search nurses by name (searches firstName and lastName)
    searchNurses: async (_, { name }) => {
      try {
        return await Nurse.find({
          $or: [
            { firstName: { $regex: name, $options: 'i' } },
            { lastName: { $regex: name, $options: 'i' } }
          ]
        });
      } catch (err) {
        throw new Error('Error searching nurses: ' + err.message);
      }
    },
    // Get nurses assigned to a specific patient
    nursesByPatient: async (_, { patientId }) => {
      try {
        return await Nurse.find({ "assignedPatients.patientId": patientId });
      } catch (err) {
        throw new Error('Error fetching nurses by patient: ' + err.message);
      }
    }
  },
  Mutation: {
    // Create a new nurse
    createNurse: async (_, { input }) => {
      try {
        const newNurse = new Nurse(input);
        return await newNurse.save();
      } catch (err) {
        throw new Error('Error creating nurse: ' + err.message);
      }
    },
    // Update nurse information
    updateNurse: async (_, { id, input }) => {
      try {
        const updatedNurse = await Nurse.findByIdAndUpdate(id, input, { new: true });
        if (!updatedNurse) throw new Error('Nurse not found');
        return updatedNurse;
      } catch (err) {
        throw new Error('Error updating nurse: ' + err.message);
      }
    },
    // Delete a nurse
    deleteNurse: async (_, { id }) => {
      try {
        await Nurse.findByIdAndDelete(id);
        return true;
      } catch (err) {
        throw new Error('Error deleting nurse: ' + err.message);
      }
    },
    // Assign a patient to a nurse
    assignPatient: async (_, { nurseId, patientId, primaryCare }) => {
      try {
        const updatedNurse = await Nurse.findByIdAndUpdate(
          nurseId,
          {
            $push: {
              assignedPatients: {
                patientId,
                primaryCare,
                assignmentDate: new Date()
              }
            }
          },
          { new: true }
        );
        if (!updatedNurse) throw new Error('Nurse not found');
        return updatedNurse;
      } catch (err) {
        throw new Error('Error assigning patient: ' + err.message);
      }
    },
    // Remove a patient assignment from a nurse
    removePatientAssignment: async (_, { nurseId, patientId }) => {
      try {
        const updatedNurse = await Nurse.findByIdAndUpdate(
          nurseId,
          {
            $pull: {
              assignedPatients: { patientId }
            }
          },
          { new: true }
        );
        if (!updatedNurse) throw new Error('Nurse not found');
        return updatedNurse;
      } catch (err) {
        throw new Error('Error removing patient assignment: ' + err.message);
      }
    },
    // Update nurse's work schedule
    updateWorkSchedule: async (_, { nurseId, schedule }) => {
      try {
        const updatedNurse = await Nurse.findByIdAndUpdate(
          nurseId,
          { workSchedule: schedule },
          { new: true }
        );
        if (!updatedNurse) throw new Error('Nurse not found');
        return updatedNurse;
      } catch (err) {
        throw new Error('Error updating work schedule: ' + err.message);
      }
    }
  }
};

export default resolvers;
