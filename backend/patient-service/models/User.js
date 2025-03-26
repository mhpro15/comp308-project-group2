const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "nurse", "admin"], required: true },
    accountStatus: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },
    lastLogin: { type: Date },
    refreshToken: { type: String }
  }, { timestamps: true });
  
  const User = mongoose.model("User", userSchema);