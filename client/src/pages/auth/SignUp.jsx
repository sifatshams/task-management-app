import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useUser } from '../../context/userContext';
import { API_PATHS } from '../../utils/api_path';
import axiosInstance from '../../utils/axios_instance';
import { validateEmail } from '../../utils/helper';
import uploadImage from '../../utils/upload_image';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // custom hook
  const { updateUser } = useUser();

  // handle signUp from submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    // validation
    if (!fullName) {
      setError('Please enter your full name!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address!');
      return;
    }

    if (!password) {
      setError('Please enter the passcode!');
      return;
    }

    setError('');

    // signup api call
    try {
      // upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImage: profileImageUrl,
        adminInviteToken,
      });

      // data from backend res structure
      const { success, user } = response.data;

      if (success && user) {
        updateUser({
          ...user,
          token: user.token || response.data?.token,
        });

        // role based redirect
        if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      } else {
        setError('Registration failed! Invalid response from server.');
      }
    } catch (err) {
      // safe error message extraction
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again!';
      setError(errorMsg);
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="you@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="text"
            />
          </div>

          {/* error msg */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="w-full mt-5 cursor-pointer bg-primary hover:bg-blue-500 transition-all text-white py-3 rounded-lg"
          >
            SignUp
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{' '}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
