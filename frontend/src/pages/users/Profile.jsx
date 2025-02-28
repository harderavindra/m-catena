import React, { useState, useEffect } from 'react'
import Avatar from '../../components/common/Avatar'
import { getMe } from '../../api/authApi'
import axiosInstance from '../../api/axiosInstance';
import { FiCalendar, FiCheck, FiCheckSquare, FiEdit3, FiMail, FiPhone } from "react-icons/fi";
import { formatDateTime } from '../../utils/formatDateTime';
import InputText from "../../components/common/InputText";
import StatusBubble from '../../components/ui/StatusBubble';
const designations = {
  Internal: ["Manager", "Sales Manager"],
  Vendor: ["Designer", "Content Writer"],
};
const ViewText = ({ children }) => (<p className='text-xl capitalize'>{children}</p>)
const EditButton = ({ isEditing, toggleEdit, updateProfile, isDisabled }) => {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded-md 
        ${isEditing
          ? isDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white cursor-pointer"
          : "border border-blue-300/70 bg-blue-100 text-blue-800 cursor-pointer"}
      `}
      onClick={isEditing ? updateProfile : toggleEdit}
      disabled={isEditing && isDisabled}
    >
      {isEditing ? <FiCheck /> : <FiEdit3 />}
    </button>
  );
};


const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileUser, setProfileUser] = useState(null)
  const [editSections, setEditSections] = useState({
    personalInfo: false,
    location: false,
    professionalInfo: false,
    status: false,
  });
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axiosInstance.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileUser(response.data)
        console.log(response.data.firstName)
      } catch (error) {

      }
    }
    fetchProfile()
  }, [])
  const toggleEditSection = (section) => {
    setEditSections((prev) => ({
      personalInfo: false,
      professionalInfo: false,
      otherSection: false, // Add any other sections here
      [section]: !prev[section], // Toggle the clicked section
    }));
  }
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    console.log(name)
    if (["city", "state", "country"].includes(name)) {
      setUpdatedFields(prev => ({
        ...prev,
        location: {
          ...(prev.location || profileUser.location || {}), // Ensure existing data is retained
          [name]: value, // Only update the specific field
        },
      }));
    } else {
      setUpdatedFields(prev => ({ ...prev, [name]: value }));
    }
  };
  const updateUserProfile = async () => {
    if (Object.keys(updatedFields).length === 0) return; // No updates

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/users/${profileUser._id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileUser(prev => ({ ...prev, ...updatedFields })); // Update UI
      setUpdatedFields({}); // Reset changed fields
      setEditSections(prev => ({ ...prev, personalInfo: false, professionalInfo: false, status: false })); // Close edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
  return (
    <div className='flex gap-20'>
      <div className='bg-white rounded-lg border border-blue-300/70 flex flex-col min-h-full min-w-[20%] items-center  '>
        {profileUser && (
          <>
            <div className='p-5 text-center relative w-full items-center justify-center'>
              <StatusBubble size='sm' status={`${profileUser.status === 'active' ? 'success' : 'error'}`} icon={profileUser.status === 'inactive' ? 'eyeOff' : 'check'} className='absolute right-5 top-5' />
              <Avatar size='xl' />


              <h2 className='text-lg font-bold'>{profileUser.firstName} {profileUser.lastName}</h2>
              <p className='capitalize font-semibold text-lg text-blue-600'>{profileUser.role.toLowerCase()}</p>
              <p className='capitalize font-semibold text-sm text-gray-400'>{profileUser.designation.toLowerCase()}</p>
              <p className='capitalize  text-base text-gray-400'>{profileUser.location.city}{profileUser.location.city ? ',' : ''}{profileUser?.location?.state}</p>


            </div>
            <div className='w-full border-t border-t-blue-300/70 py-3 px-5 flex flex-col gap-2'>
              <p className='  text-sm text-gray-400 flex items-center gap-2'><FiPhone size={14} />{profileUser.contactNumber}</p>
              <p className='  text-sm text-gray-400 flex items-center gap-2 lowercase'><FiMail size={14} />{profileUser.email}</p>
              <p className='  text-sm text-gray-400 flex items-center gap-2 lowercase'><FiCalendar size={14} />{formatDateTime(profileUser.createdAt)}</p>
              <p className='  text-sm text-gray-400 flex items-center gap-2 lowercase'><FiCheckSquare size={14} />{formatDateTime(profileUser.lastUpdatedAt)}</p>
            </div>
          </>
        )
        }
      </div>
      <div className='flex flex-col min-h-full w-full bg-white'>
        <div className='fle gap-4 bg-gray-50 rounded-lg items-start justify-start'>
          <div className=' bg-white rounded-t-md w-fit border border-blue-300/70 overflow-hidden  ' style={{ boxShadow: "inset 0px -6px 5px 0px rgba(0, 0, 0, 0.13)" }}>
            <button className={`px-4 py-2 cursor-pointer ${activeTab === "profile" ? 'bg-red-600/90 text-white' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
            <button className={`px-4 py-2 cursor-pointer ${activeTab === "password" ? 'bg-red-600/90 text-white' : ''}`} onClick={() => setActiveTab('password')}>Change Password</button>
          </div>
        </div>
        <div className=' w-full p-8 border border-blue-300/70 h-full rounded-b-lg '>
          {
            activeTab === "profile" ? (

              <div className='flex flex-col gap-3' >
                <div className='flex gap-8 max-w-2xl items-end'>
                  <div className='w-full'>
                    <label className='text-gray-400 mb-1'>First Name</label>
                    {
                      editSections.personalInfo ? (
                        <>
                          <InputText
                            value={updatedFields.firstName ?? profileUser?.firstName}
                            name="firstName"
                            placeholder="First Name"
                            handleOnChange={handleOnChange}
                          />



                        </>
                      ) : (

                        <ViewText>{profileUser?.firstName}</ViewText>



                      )
                    }

                  </div>
                  <div className='w-full'>
                    <label className='text-gray-400 mb-1'>Last Name</label>

                    {
                      editSections.personalInfo ? (
                        <InputText
                          value={updatedFields.lastName ?? profileUser?.lastName}
                          name="lastName"
                          placeholder="Last Name"
                          handleOnChange={handleOnChange}
                        />) : (<ViewText>{profileUser?.lastName}</ViewText>
                      )}
                  </div>
                  <div>
                    <EditButton
                      isEditing={editSections.personalInfo}
                      toggleEdit={() => toggleEditSection("personalInfo")}
                      updateProfile={updateUserProfile}
                      isDisabled={Object.keys(updatedFields).length === 0}
                    />
                  </div>
                </div>
                <div className='flex gap-8 max-w-2xl items-end'>
                  <div className='w-full'>
                    <label className='text-gray-400'>City</label>
                    {
                      editSections.location ? (
                        <InputText
                          value={updatedFields?.location?.city ?? profileUser?.location?.city ?? ""}
                          name="city"
                          placeholder="City"
                          handleOnChange={handleOnChange}
                        />) : (<ViewText>{profileUser?.location?.city}</ViewText>
                      )}
                  </div>
                  <div className='w-full'>
                    <label className='text-gray-400'>State</label>
                    {
                      editSections.location ? (
                        <InputText
                          value={updatedFields?.location?.state ?? profileUser?.location?.state ?? ""}
                          name="state"
                          placeholder="State"
                          handleOnChange={handleOnChange}
                        />) : (<ViewText>{profileUser?.location?.state ?? " N/A"}</ViewText>
                      )}
                  </div>
                 
                  <div>
                    <EditButton
                      isEditing={editSections.location}
                      toggleEdit={() => toggleEditSection("location")}
                      updateProfile={updateUserProfile}
                      isDisabled={Object.keys(updatedFields).length === 0}
                    />
                  </div>
                </div>
                <div className='flex gap-8 max-w-2xl items-end'>
                  <div className='w-full'>
                    <label className='text-gray-400'>User Type</label>
                    {editSections.professionalInfo ? (

                      <select className='w-full border border-gray-400 rounded-md py-1 px-2'
                        name="userType"
                        value={updatedFields.userType ?? profileUser?.userType}
                        onChange={(e) => {
                          const selectedUserType = e.target.value;
                          setUpdatedFields((prev) => ({
                            ...prev,
                            userType: selectedUserType,
                            designation: "", // Reset designation when user type changes
                          }));
                        }}
                      >
                        <option value="Internal">Internal</option>
                        <option value="Vendor">Vendor</option>
                      </select>
                    ) : (<ViewText>{profileUser?.userType}</ViewText>)}

                  </div>
                  <div className='w-full'>
                    <label className='text-gray-400'>Designation</label>

                    {editSections.professionalInfo ? (

                      <select className='w-full border border-gray-400 rounded-md py-1 px-2'
                        name="designation"
                        value={updatedFields.designation ?? profileUser?.designation}
                        onChange={handleOnChange}
                      >
                        <option value="" disabled>Select</option>

                        {((updatedFields.userType ?? profileUser?.userType) === "Internal"
                          ? designations.Internal
                          : designations.Vendor
                        ).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    ) : (<ViewText>{profileUser?.designation}</ViewText>)}

                  </div>
                  <div>
                    <EditButton
                      isEditing={editSections.professionalInfo}
                      toggleEdit={() => toggleEditSection("professionalInfo")}
                      updateProfile={updateUserProfile}
                      isDisabled={Object.keys(updatedFields).length === 0}
                    />
                  </div>
                </div>
                <div className='flex gap-8 max-w-2xl items-end'>
                  <div className='w-full'>
                    <label className='text-gray-400'>Status</label>
                    {editSections.status ? (
                      <select className='w-full border border-gray-400 rounded-md py-1 px-2'
                        name="status"
                        value={updatedFields.status ?? profileUser?.status}
                        onChange={handleOnChange}
                      >
                        <option value="" disabled>Select</option>
                        <option value="active" >Active</option>
                        <option value="inactive" >Inactive</option>
                      </select>
                    ) : (
                      <ViewText>{profileUser?.status}</ViewText>
                    )}
                  </div>
                  <div className='w-full'>

                  </div>
                  <div>
                  
                        <EditButton
                      isEditing={editSections.status}
                      toggleEdit={() => toggleEditSection("status")}
                      updateProfile={updateUserProfile}
                      isDisabled={Object.keys(updatedFields).length === 0}
                    />

                  </div>
                </div>


              </div>
            ) : 'Password'
          }
        </div>
      </div>

    </div>
  )
}

export default Profile