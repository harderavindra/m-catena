import React, { useState } from "react";
import useFetchUsers from "../../hooks/useFetchUsers";
import UserCard from "../../components/common/UserCard";
import SearchInput from "../../components/common/SearchInput";
import DropdownFilter from "../../components/common/DropdownFilter";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const [page, setPage] = useState(1);
    const [role, setRole] = useState("");
    const [designation, setDesignation] = useState("");
    const [search, setSearch] = useState("");
    const navigate= useNavigate()
    const { users, loading, error, pagination } = useFetchUsers(page, 10, role, designation, search);

    const clearAll = () => {
        setDesignation("");
        setRole("");
        setSearch("");
    };

    return (
        <div className="p-6">
            <div className="flex mb-4 justify-between">
                <div className="flex gap-4">
                <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search by name" />

                <DropdownFilter
                    options={{ label: "Roles", items: [{ value: "ADMIN", label: "Admin" }, { value: "MANAGER", label: "Manager" }, { value: "USER", label: "User" }] }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onClear={() => setRole("")}
                />

                <DropdownFilter
                    options={{
                        label: "Designations",
                        items: [
                            { value: "Manager", label: "Manager" },
                            { value: "Sales Manager", label: "Sales Manager" },
                            { value: "Designer", label: "Designer" },
                            { value: "Content Writer", label: "Content Writer" },
                        ],
                    }}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    onClear={() => setDesignation("")}
                />

                <button className="border border-blue-300 bg-blue-50 rounded-md px-3 text-blue-600 cursor-pointer" onClick={clearAll}>
                    Clear All
                </button>
                </div>
                <Button onClick={()=>navigate('/adduser')}>Add User</Button>
            </div>

            {/* Users List */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length > 0 ? (
                <div className="grid grid-cols-4 gap-10">
                    {users.map((user) => (
                        <UserCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <p>No users found</p>
            )}

            {/* Pagination */}
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
    );
};

export default UsersPage;
