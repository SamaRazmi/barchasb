const resumeInitialValues = {
  personal: {
    avatar: "",
    fullName: "",
    phone: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    address: "",
    skills: "",
    salary: "",
  },
  cooperate: [], // fullTime / partTime
  insurance: "", // iAm / iAmNot
  transfer: "", // do / doNot
  educationHistory: [{ degree: "", school: "", gpa: "" }],
  workHistory: [
    { place: "", companyName: "", duration: "" },
    { place: "", companyName: "", duration: "" },
  ],
  honors: [{ title: "", Provider: "", ProviderDate: "" }],
};
export default resumeInitialValues;
