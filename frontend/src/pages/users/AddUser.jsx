import React, { useState } from 'react';
import InputText from '../../components/common/InputText';
import { registerUser } from "../../api/userApi"; // Import function
import { states, citySuggestions, designations } from "../../utils/constants";
import Button from '../../components/common/Button';



const AddUser = () => {
  const [dataFields, setDataFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    userType: "",
    designation: "",
    location: { city: "", state: "", country: "" }
  });
  const [cityOptions, setCityOptions] = useState([]); // Suggested cities

  const [error, setError] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setDataFields((prev) => ({
        ...prev,
        location: { ...prev.location, state: value, city: "" }, // Reset city when state changes
      }));
      setCityOptions(citySuggestions[value] || []); // Update city options
    } else if (name === "city") {
      setDataFields((prev) => ({
        ...prev,
        location: { ...prev.location, city: value },
      }));
    } else if (["city", "state", "country"].includes(name)) {
      setDataFields((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value.trim() },
      }));
    } else {
      setDataFields((prev) => ({ ...prev, [name]: value.trim() }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = {
        ...dataFields,
        userType: dataFields.userType, // ✅ Convert to lowercase
        role: "USER",
      };
      console.log(userData)


      console.log("Sending data to backend:", userData);

      await registerUser(userData);
      console.log("User registered successfully");

      setDataFields({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        password: "",
        userType: "",
        designation: "",
        location: { city: "", state: "", country: "" },
      });
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='flex flex-col gap-4 bg-white border border-blue-300/60 rounded-lg w-fit p-6 px-10'>
      <form onSubmit={handleSubmit}>
        <div className='w-3xl flex flex-col gap-3'>
          <div className='flex gap-8'>
            <InputText name="firstName" value={dataFields.firstName} label="First Name" handleOnChange={handleOnChange} />
            <InputText name="lastName" value={dataFields.lastName} label="Last Name" handleOnChange={handleOnChange} />
          </div>
          <div className='flex gap-8'>
            <InputText name="email" value={dataFields.email} label="Email" handleOnChange={handleOnChange} />
            <InputText name="contactNumber" value={dataFields.contactNumber} label="Contact Number" handleOnChange={handleOnChange} />
          </div>
          <div className='flex gap-8'>
            <InputText name="password" value={dataFields.password} label="Password" handleOnChange={handleOnChange} />
            <div className='w-full'></div>
          </div>
          <div className='flex gap-8'>
            <div className='flex flex-col gap-1 w-full'>
              <label>User Type</label>
              <select
                className='w-full border border-gray-400 rounded-md py-1 px-2'
                name="userType"
                value={dataFields.userType}
                onChange={(e) => {
                  setDataFields((prev) => ({
                    ...prev,
                    userType: e.target.value,
                    designation: "", 
                  }));
                }}
              >
                <option value="">Select User Type</option>
                <option value="Internal">Internal</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label>Designation</label>
              <select
                className='w-full border border-gray-400 rounded-md py-1 px-2'
                name="designation"
                value={dataFields.designation}
                onChange={handleOnChange}
                disabled={!dataFields.userType}
              >
                <option value="">Select Designation</option>
                {designations[dataFields.userType.charAt(0).toUpperCase() + dataFields.userType.slice(1)]?.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label>State</label>
              <select
                className="w-full border border-gray-400 rounded-md py-1 px-2"
                name="state"
                value={dataFields.location.state}
                onChange={handleOnChange}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={dataFields.location.city}
                onChange={handleOnChange}
                placeholder="Start typing city..."
                className="w-full border border-gray-400 rounded-md py-1 px-2"
                list="cityList"
              />
              <datalist id="cityList">
                {cityOptions.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <Button type='submit'>Add</Button>
          </div>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddUser;
