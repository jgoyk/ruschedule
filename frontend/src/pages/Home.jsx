import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5001/users")
      .then((response) => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="">
      <nav className="bg-red-100 p-4 flex flex-row justify-center">
        <div className="text-center w-full font-semibold text-3xl">
          RU SCHEDULING
        </div>
        <div className="min-w-fit">
          {isLoading ? (<div>Loading</div> ) :
          (!isAuthenticated ? (
            <LoginButton />
          ) : (
            <div className="min-w-fit flex flex-row align-middle min-h-full">
              <div className="p-2 min-w-fit flex flex-row bg-red-300 rounded-full">
                <a href="/profile" className="flex flex-row min-h-full min-w-fit align-middle">
                  <CgProfile className="align-middle min-h-full" />
                  <div className="">Profile</div>
                </a>
              </div>
              <div className="pl-2">
                <LogoutButton />
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {users?.map((user, index) => (
              <div key={user._id}>{user.username}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
