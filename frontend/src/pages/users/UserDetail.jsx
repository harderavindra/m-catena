import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserById, updateUserById } from "../../api/userApi"; // Import function
import { FiCalendar, FiCheck, FiCheckSquare, FiEdit3, FiMail, FiPhone } from "react-icons/fi";
import InputText from "../../components/common/InputText";

import UserProfileCard from "../../components/common/UserProfileCard";
import AdminResetPassword from "../../components/common/AdminResetPassword";
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

const UserDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("profile");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editSections, setEditSections] = useState({
        personalInfo: false,
        location: false,
        professionalInfo: false,
        status: false,
    });
    const [updatedFields, setUpdatedFields] = useState({});

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const data = await fetchUserById(id);
                setUser(data);
            } catch (err) {
                setError(err.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, [id]);
    const updateUserProfile = async (e) => {
        e.preventDefault();
        try {
            await updateUserById(id, updatedFields);
            // alert("User updated successfully!");
            setUser((prevUser) => ({ ...prevUser, ...updatedFields })); // Update state
            setUpdatedFields({}); // Reset changed fields
            setEditSections(prev => ({ ...prev, personalInfo: false, location: false, professionalInfo: false, status: false })); // Close edit mode

            //  setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        }
    };
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        console.log(name)
        if (["city", "state", "country"].includes(name)) {
            setUpdatedFields(prev => ({
                ...prev,
                location: {
                    ...(prev.location || user.location || {}), // Ensure existing data is retained
                    [name]: value, // Only update the specific field
                },
            }));
        } else {
            setUpdatedFields(prev => ({ ...prev, [name]: value }));
        }
    };
    const toggleEditSection = (section) => {
        setEditSections((prev) => ({
            personalInfo: false,
            professionalInfo: false,
            otherSection: false, // Add any other sections here
            [section]: !prev[section], // Toggle the clicked section
        }));
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className='flex gap-20'>
            <UserProfileCard user={user} />
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
                            <div>
                <div className='flex gap-8 max-w-2xl items-end'>
                    <div className='w-full'>
                        <label className='text-gray-400 mb-1'>First Name</label>
                        {
                            editSections.personalInfo ? (
                                <>
                                    <InputText
                                        value={updatedFields.firstName ?? user?.firstName}
                                        name="firstName"
                                        placeholder="First Name"
                                        handleOnChange={handleOnChange}
                                    />
                                </>
                            ) : (
                                <ViewText>{user?.firstName}</ViewText>
                            )
                        }
                    </div>
                    <div className='w-full'>
                        <label className='text-gray-400 mb-1'>Last Name</label>
                        {
                            editSections.personalInfo ? (
                                <>
                                    <InputText
                                        value={updatedFields.lastName ?? user?.lastName}
                                        name="lastName"
                                        placeholder="Last Name"
                                        handleOnChange={handleOnChange}
                                    />
                                </>
                            ) : (
                                <ViewText>{user?.lastName}</ViewText>
                            )
                        }
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
                                    value={updatedFields?.location?.city ?? user?.location?.city ?? ""}
                                    name="city"
                                    placeholder="City"
                                    handleOnChange={handleOnChange}
                                />) : (<ViewText>{user?.location?.city}</ViewText>
                            )}
                    </div>
                    <div className='w-full'>
                        <label className='text-gray-400'>State</label>
                        {
                            editSections.location ? (
                                <InputText
                                    value={updatedFields?.location?.state ?? user?.location?.state ?? ""}
                                    name="state"
                                    placeholder="State"
                                    handleOnChange={handleOnChange}
                                />) : (<ViewText>{user?.location?.state ?? " N/A"}</ViewText>
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
                                value={updatedFields.userType ?? user?.userType}
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
                        ) : (<ViewText>{user?.userType}</ViewText>)}

                    </div>
                    <div className='w-full'>
                        <label className='text-gray-400'>Designation</label>

                        {editSections.professionalInfo ? (

                            <select className='w-full border border-gray-400 rounded-md py-1 px-2'
                                name="designation"
                                value={updatedFields.designation ?? user?.designation}
                                onChange={handleOnChange}
                            >
                                <option value="" disabled>Select</option>

                                {((updatedFields.userType ?? user?.userType) === "Internal"
                                    ? designations.Internal
                                    : designations.Vendor
                                ).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        ) : (<ViewText>{user?.designation}</ViewText>)}

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
                                value={updatedFields.status ?? user?.status}
                                onChange={handleOnChange}
                            >
                                <option value="" disabled>Select</option>
                                <option value="active" >Active</option>
                                <option value="inactive" >Inactive</option>
                            </select>
                        ) : (
                            <ViewText>{user?.status}</ViewText>
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
                        ) : (
                            <div>
                                <AdminResetPassword userId={user._id}/>
                                </div>
                        )
                    }
                </div>
            </div>

            
        </div>
    );
};

export default UserDetail;
