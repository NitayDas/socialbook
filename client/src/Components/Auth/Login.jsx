import React, { useState } from "react";
import { useUser } from "../../Provider/UserProvider";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from '../AxiosInstance'
import LoginImage from '../../assets/images/login.png';
import GoogleImage from '../../assets/images/google.svg'
import mainLogo from '../../assets/images/logo.svg'
import '../../assets/css/common.css';
import '../../assets/css/main.css';
import '../../assets/css/responsive.css';

const Login = () => {
  const { setUser, storeTokens } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await AxiosInstance.post("auth/login/", formData);
      const { user, tokens } = response.data;
      console.log("Login successful:", user, tokens); // Debugging line
      storeTokens(tokens.access, tokens.refresh);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/feed", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_login_wrapper">
      <div className="_shape_one" />
      <div className="_shape_two" />
      <div className="_shape_three" />

      <div className="_dis_flex_all">
        <div className="_flex_row _flex_wrap mx-auto w-full max-w-[1200px] flex flex-wrap md:flex-nowrap">

          {/* Left Image Section */}
          <div className="_flex_auto _dis_flex_all _flex_column w-full md:w-1/2 px-4 flex flex-col items-center md:items-start">
            <div className="_left_logo _mar_b30 my-6 md:my-0">
              <img src={mainLogo} alt="Logo" className="mx-auto md:mx-0" />
            </div>
            <div className="_left_img">
              <img src={LoginImage} alt="Login" className="max-w-full" />
            </div>
          </div>

          {/* Right Form Section */}
          <div className="_flex_auto _dis_flex_all _flex_column w-full md:w-1/2 px-4 flex justify-center items-center mt-8 md:mt-0">
            <div className="_social_login_content w-full max-w-md mx-auto">
              
              <h2 className="_social_login_content_title _mar_b10 mt-3 text-center text-2xl md:text-3xl font-semibold">Welcome back</h2>
              <p className="_social_login_content_para text-black text-center mb-6">Login to your account</p>

              <button type="button" className="_social_login_content_btn _mar_b30 w-full flex items-center justify-center gap-2 py-3 mb-6 border rounded-md hover:bg-gray-100">
                <img src={GoogleImage} alt="Google" className="_google_img w-5 h-5" />
                <span>Sign-in with Google</span>
              </button>

              <div className="_social_login_content_bottom_txt _mar_b30 text-center mb-6">
                <span>Or</span>
              </div>

              {errors.general && (
                <div className="_mar_b20 text-center bg-red-100 text-red-600 p-3 rounded-md mb-4">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 w-full">
                <div>
                  <label className="_social_login_label _mar_b10 block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="_social_login_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                  {errors.email && <div className="_social_login_form_left_para text-red-500 mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label className="_social_login_label _mar_b10 block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="_social_login_input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  {errors.password && <div className="_social_login_form_left_para text-red-500 mt-1">{errors.password}</div>}
                </div>

                <div className="_dis_flex _mar_b30 flex justify-between items-center">
                  <label className="_dis_flex _dis_flex_cntr1 _social_login_form_check_label flex items-center gap-2">
                    <input type="checkbox" className="_social_login_form_check_input w-4 h-4 border border-gray-300 rounded" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="_social_login_form_left_para text-blue-500">Forgot password?</Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="_btn1 w-full py-3 bg-blue-500 text-white rounded-md text-lg font-medium"
                  style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? "Signing in..." : "Login now"}
                </button>
              </form>

              <p className="_social_login_bottom_txt_para text-center mt-5">
                Don't have an account? <Link to="/register" className="text-blue-500">Create New Account</Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Login;
