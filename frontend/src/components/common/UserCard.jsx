import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import Avatar from "./Avatar"; // Adjust import path if needed
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-white border border-blue-300/60 rounded-xl p-6 gap-2 shadow-md"  onClick={() => navigate(`/user/${user._id}`)}>
      <span className="self-end cursor-pointer">
        <FiMoreVertical />
      </span>
      <Avatar size="lg" />
      <p className="text-lg font-bold">
        {user.firstName} {user.lastName}
      </p>
      <p className="text-sm font-semibold text-gray-400">{user.designation}</p>
      <p className="text-base font-normal text-gray-400">
        {user.location?.city}, {user.location?.state}
      </p>
    </div>
  );
};

export default UserCard;
