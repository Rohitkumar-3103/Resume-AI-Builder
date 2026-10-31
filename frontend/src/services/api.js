import axios from "axios";

export const ASSET_URL = "http://localhost:5001";

const API = axios.create({
  baseURL: `${ASSET_URL}/api`
});

// Interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth services
export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await API.post("/auth/register", { name, email, password });
  return response.data;
};

// Resume services
export const getResumes = async () => {
  const response = await API.get("/resumes");
  return response.data;
};

export const getResume = async (id) => {
  const response = await API.get(`/resumes/${id}`);
  return response.data;
};

export const createResume = async (data) => {
  const response = await API.post("/resumes", data);
  return response.data;
};

export const updateResume = async (id, data) => {
  const response = await API.put(`/resumes/${id}`, data);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await API.delete(`/resumes/${id}`);
  return response.data;
};

// Upload service
export const uploadImage = async (formData) => {
  const response = await API.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

// AI services
export const generateSummary = async (jobTitle) => {
  const response = await API.post("/ai/generate-summary", { jobTitle });
  return response.data;
};

export const generateExperience = async (positionTitle) => {
  const response = await API.post("/ai/generate-experience", { positionTitle });
  return response.data;
};

export const generateCoverLetter = async (payload) => {
  const response = await API.post("/ai/generate-cover-letter", payload);
  return response.data;
};

export const detectAIContent = async (payload) => {
  const response = await API.post("/ai/detect", payload);
  return response.data;
};

export const humanizeAIContent = async (payload) => {
  const response = await API.post("/ai/humanize", payload);
  return response.data;
};

// Resume Upload & Parser services (PDF, DOCX, TXT)
export const parseResumeFile = async (formData) => {
  const response = await API.post("/ai/parse-resume-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const parseResumeText = async (text) => {
  const response = await API.post("/ai/parse-resume-file", { text });
  return response.data;
};

// ATS Screening & Keyword Matcher (ATS Beater)
export const matchATS = async (payload) => {
  const response = await API.post("/ai/match-ats", payload);
  return response.data;
};

// Deep AI Resume Quality Scorer
export const scoreResume = async (payload) => {
  const response = await API.post("/ai/score-resume", payload);
  return response.data;
};

// AI Interview Coach
export const getInterviewPrep = async (payload) => {
  const response = await API.post("/ai/interview-prep", payload);
  return response.data;
};

export default API;