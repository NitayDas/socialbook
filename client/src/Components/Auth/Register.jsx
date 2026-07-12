import React, { useState } from "react";
import { useUser } from "../../Provider/UserProvider";
import { useNavigate, Link } from "react-router-dom";
import RegisterImage from '../../assets/images/registration.png'
import mainLogo from '../../assets/images/logo.svg'
import GoogleImage from '../../assets/images/google.svg'
import AxiosInstance from "../AxiosInstance";
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import '../../assets/css/responsive.css';

const Register = () => {
  const { setUser, storeTokens } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await AxiosInstance.post("/auth/register/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
      });

      const { user, tokens } = response.data;
      storeTokens(tokens.access, tokens.refresh);
      setUser(user);
      navigate("/feed", { replace: true });
    } catch (error) {
      let message = "Registration failed";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") message = data;
        else if (data.detail) message = data.detail;
        else if (data.email) message = data.email[0];
        else if (data.password) message = data.password[0];
      }
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="_social_registration_wrapper flex justify-center items-center min-h-screen px-4 md:px-0">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">

        {/* Left Image Section */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <img src={RegisterImage} alt="Registration Illustration" className="w-full h-auto" />
        </div>

        {/* Right Form Section */}
        <div className="_social_registration_content w-full md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-md">
            <div className="_right_logo mb-6">
              <img src={mainLogo} alt="Logo" className="w-full"/>
            </div>

            <h2 className="_social_registration_content_title mt-3 text-2xl md:text-3xl font-semibold">Get Started Now</h2>
            <p className="_social_registration_content_para mb-6 text-black">Registration</p>

            <button 
              type="button"
              className="_social_login_content_btn w-full flex items-center justify-center gap-2 py-3 mb-6 border rounded-md hover:bg-gray-100"
            >
              <img src={GoogleImage} alt="Google" className="_google_img w-5 h-5" />
              <span>Sign-in with Google</span>
            </button>

            {/* Divider */}
            <div className="_social_login_content_bottom_txt text-center mb-6">
              <span>Or</span>
            </div>

            {errors.general && (
              <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-center">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label className="_social_registration_label block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="_social_registration_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                />
                {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
              </div>

              <div>
                <label className="_social_registration_label block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="_social_registration_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                />
                {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
              </div>

              <div>
                <label className="_social_registration_label block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="_social_registration_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>

              <div>
                <label className="_social_registration_label block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="_social_registration_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
              </div>

              <div>
                <label className="_social_registration_label block mb-1">Repeat Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="_social_registration_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
              </div>

              <div className="flex items-center mt-2 mb-4">
                <input type="checkbox" id="terms" className="_social_registration_form_check_input w-4 h-4 border-gray-300 rounded"/>
                <label htmlFor="terms" className="_social_registration_form_left_para ml-2 text-sm">I agree to terms & conditions</label>
              </div>

              <button
                type="submit"
                className="_btn1 w-full py-3 bg-blue-500 text-white rounded-md text-lg font-medium"
                disabled={loading}
              >
                <span>{loading ? "Creating Account..." : "Register"}</span>
              </button>
            </form>

            <p className="_social_registration_bottom_txt_para text-center mt-6">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500">Login Now</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
