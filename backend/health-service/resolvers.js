const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const User = require("./models/User");
const VitalSigns = require("./models/VitalSigns");
const Alert = require("./models/EmergencyAlert");
const Motivation = require("./models/Motivation");
const SymptomRecord = require("./models/SymptomRecord");
require("dotenv").config();
// Configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d"; // Token expires in 1 day

const resolvers = {
  User: {
    __resolveReference: async (reference) => {
      // Resolver for User entity references from other services
      return User.findById(reference.id).select("-password");
    },
  },

  Query: {
    currentUser: async (_, __, context) => {
      const user = await checkAuth(context);
      return User.findById(user.id).select("-password");
    },

    getAllUsers: async (_, { role }, context) => {
      await checkAuth(context, ["nurse"]);
      const query = role ? { role } : {};
      return User.find(query).select("-password");
    },

    // Get single user
    getUser: async (_, { id }, context) => {
      await checkAuth(context);
      return User.findById(id).select("-password");
    },

    // Get vital signs by ID
    getVitalSigns: async (_, { id }, context) => {
      await checkAuth(context);
      return VitalSigns.findById(id).populate("PatientID NurseID");
    },

    // Get vital signs for a specific patient
    getPatientVitalSigns: async (_, { PatientID }, context) => {
      await checkAuth(context);
      return VitalSigns.find({ PatientID })
        .populate("PatientID NurseID")
        .sort({ timeStamp: -1 });
    },

    // Get symptom record by ID
    getSymptomRecord: async (_, { id }, context) => {
      await checkAuth(context);
      return SymptomRecord.findById(id).populate("PatientID");
    },

    // Get symptom records for a specific patient
    getPatientSymptoms: async (_, { PatientID }, context) => {
      await checkAuth(context);
      return SymptomRecord.find({ PatientID })
        .populate("PatientID")
        .sort({ submissionDate: -1 });
    },

    motivationsByPatient: async (_, { patientId }, { user }) => {
      if (!user || (user.role !== "patient" && user.role !== "nurse")) {
        throw new Error("Unauthorized access");
      }

      // Optionally, restrict patient to only their own data
      if (user.role === "patient" && user.id !== patientId) {
        throw new Error("Access denied");
      }

      return await Motivation.find({ PatientID: patientId }).populate(
        "PatientID NurseID"
      );
    },
  },

  Mutation: {
    // Register new user
    register: async (_, { input }) => {
      const { email, password, name, role } = input;

      // Check if user exists
      const exists = await User.findOne({ email });
      if (exists) throw new Error("Email already in use");

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role,
      });

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    // Login user
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError("Invalid credentials");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new AuthenticationError("Invalid credentials");

      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    // Update user (authenticated users can update themselves, nurses can update patients)
    updateUser: async (_, { id, input }, context) => {
      const authUser = await checkAuth(context);

      // Check permissions
      if (authUser.id !== id && authUser.role !== "nurse") {
        throw new AuthenticationError("Not authorized to update this user");
      }

      // Prevent role changing unless admin
      if (
        input.role &&
        input.role !== authUser.role &&
        authUser.role !== "admin"
      ) {
        throw new AuthenticationError("Not authorized to change roles");
      }

      // Hash new password if provided
      if (input.password) {
        input.password = await bcrypt.hash(input.password, 12);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true }
      ).select("-password");

      return updatedUser;
    },

    // Delete user (admin/nurse only)
    deleteUser: async (_, { id }, context) => {
      const authUser = await checkAuth(context, ["nurse"]);

      // Prevent self-deletion
      if (authUser.id === id) {
        throw new AuthenticationError("Cannot delete your own account");
      }

      const user = await User.findByIdAndDelete(id);
      return !!user;
    },
    // ----------------------------
    // Symptom mutations
    // ----------------------------
    submitSymptoms: async (_, { input }, { user }) => {
      // Check if user is authenticated
      if (!user || user.role !== "patient") {
        throw new AuthenticationError("Authentication required");
      }

      try {
        // Get AI prediction using our local service
        let aiPrediction = null;

        try {
          console.log(
            `Generating AI prediction for symptoms: ${input.symptoms.join(
              ", "
            )}`
          );
          aiPrediction = await aiService.predictCondition(input.symptoms);
        } catch (error) {
          console.error(`Error generating AI prediction: ${error.message}`);
          // Continue without prediction if there's an error
        }

        // Create a new symptom record using the input provided
        const newRecord = new SymptomRecord({
          PatientID: input.PatientID,
          symptoms: input.symptoms,
          submissionDate: new Date(),
          ...(aiPrediction && { aiPrediction }),
        });

        // Save the new record to the database
        await newRecord.save();
        return newRecord.populate("PatientID");
      } catch (error) {
        console.error(`Error in submitSymptoms: ${error.message}`);
        throw new Error(`Failed to submit symptoms: ${error.message}`);
      }
    },

    // Alert Mutations

    createAlert: async (_, { input }) => {
      const newAlert = new Alert({
        user: input.user,
        description: input.description,
      });

      await newAlert.save();
      return newAlert.populate("user");
    },
    resolveAlert: async (_, { id }) => {
      try {
        const deletedAlert = await Alert.findByIdAndDelete(id);
        if (!deletedAlert) {
          throw new Error("Alert not found");
        }
        return deletedAlert;
      } catch (error) {
        throw new Error("Failed to delete alert: " + error.message);
      }
    },
    // ----------------------------
    // Motivation mutations
    // ----------------------------
    createMotivation: async (_, { input }, { user }) => {
      if (!user || user.role !== "nurse" || user.id !== input.NurseID) {
        throw new Error("Unauthorized - only nurses can create motivations");
      }

      const newMotivation = new Motivation({
        PatientID: input.PatientID,
        NurseID: user.id,
        title: input.title,
        content: input.content,
        timeStamp: input.timeStamp || Date.now(),
      });

      await newMotivation.save();
      // Fix: Change from array syntax to string syntax for populate
      return newMotivation.populate("PatientID NurseID");
    },

    updateMotivation: async (_, { id, content }, { user }) => {
      const motivation = await Motivation.findById(id);
      if (!motivation) {
        throw new Error("Motivation not found");
      }

      if (
        !user ||
        user.role !== "nurse" ||
        user.id !== motivation.NurseID.toString()
      ) {
        throw new Error("Unauthorized - only the creating nurse can update");
      }

      motivation.content = content;
      await motivation.save();
      return motivation.populate("PatientID NurseID");
    },

    deleteMotivation: async (_, { id }, { user }) => {
      const motivation = await Motivation.findById(id);
      if (!motivation) {
        throw new Error("Motivation not found");
      }

      if (
        !user ||
        user.role !== "nurse" ||
        user.id !== motivation.NurseID.toString()
      ) {
        throw new Error("Unauthorized - only the creating nurse can delete");
      }

      await Motivation.findByIdAndDelete(id);
      return true;
    },
    //------------------------------
    // Vital Signs mutations
    //--------------------------------
    recordVitalSigns: async (_, { input }, req) => {
      const user = await checkAuth(req, ["nurse", "patient"]);
      // Authentication check
      if (!user) throw new AuthenticationError("Authentication required");

      // Patient can only record their own vitals
      if (user.role === "patient" && user.id !== input.PatientID) {
        throw new AuthenticationError(
          "Patients can only record their own vital signs"
        );
      }

      // Nurses can record for any patient
      const nurseID = user.role === "nurse" ? user.id : null;

      const newVitalSigns = new VitalSigns({
        PatientID: input.PatientID,
        NurseID: nurseID,
        Temperature: input.Temperature,
        heartRate: input.heartRate,
        BPsystolic: input.BPsystolic,
        BPdiastolic: input.BPdiastolic,
        RespiratoryRate: input.RespiratoryRate,
        weight: input.weight,
        notes: input.notes,
        timeStamp: new Date(),
      });

      await newVitalSigns.save();

      // Update patient's vital signs reference
      await User.findByIdAndUpdate(input.PatientID, {
        $push: { vitalSigns: newVitalSigns._id },
      });

      return newVitalSigns.populate("PatientID NurseID");
    },

    updateVitalSigns: async (_, { id, input }, { user }) => {
      // Only nurses can update
      if (!user || user.role !== "nurse") {
        throw new AuthenticationError("Only nurses can update vital signs");
      }

      const existingRecord = await VitalSigns.findById(id);
      if (!existingRecord) throw new Error("Vital signs record not found");

      const updates = {
        Temperature: input.temperature ?? existingRecord.Temperature,
        BPsystolic: input.bpSystolic ?? existingRecord.BPsystolic,
        BPdiastolic: input.bpDiastolic ?? existingRecord.BPdiastolic,
        RespiratoryRate:
          input.respiratoryRate ?? existingRecord.RespiratoryRate,
        weight: input.weight ?? existingRecord.weight,
        notes: input.notes ?? existingRecord.notes,
      };

      const updatedRecord = await VitalSigns.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      ).populate("PatientID NurseID");

      return updatedRecord;
    },

    deleteVitalSigns: async (_, { id }, { user }) => {
      // Only nurses can delete
      if (!user || user.role !== "nurse") {
        throw new AuthenticationError("Only nurses can delete vital signs");
      }

      const result = await VitalSigns.findByIdAndDelete(id);

      // Remove reference from patient
      if (result) {
        await User.findByIdAndUpdate(result.PatientID, {
          $pull: { vitalSigns: result._id },
        });
      }

      return !!result;
    },
  },

  // Field resolvers for relationships
  User: {
    NurseID: async (parent) => {
      if (!parent.NurseID) return null;
      return User.findById(parent.NurseID).select("-password");
    },
    PatientID: async (parent) => {
      if (!parent.PatientID) return null;
      return User.findById(parent.PatientID).select("-password");
    },
    vitalSigns: async (parent) => {
      return VitalSigns.find({ PatientID: parent._id });
    },
  },
};

// Helper functions
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function checkAuth(context, allowedRoles = []) {
  // console.log("Context received:", context);
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new AuthenticationError("Authentication required");

  const token = authHeader.split(" ")[1];
  if (!token) throw new AuthenticationError("Invalid token format");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) throw new AuthenticationError("User no longer exists");

    // Check role permissions if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      throw new AuthenticationError("Insufficient permissions");
    }

    return user;
  } catch (err) {
    throw new AuthenticationError("Invalid or expired token");
  }
}

module.exports = resolvers;
