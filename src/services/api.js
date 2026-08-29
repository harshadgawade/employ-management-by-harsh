// Base Spring Boot API URL (Deploy hone par Render.com Domain yahan badlein)
const API_BASE_URL = 'http://localhost:8080/api';

export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    return await response.json();
  } catch (err) {
    console.error('API Connect Error:', err);
    return [];
  }
};

export const verifyHrOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return await response.json();
  } catch (err) {
    console.error('Auth Error:', err);
    return { success: false };
  }
};