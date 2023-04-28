import { Navigate } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import { Modal } from "@mui/material";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import SignUp from "../../Components/UserRegistryPage/SignUp";
import UsersTable from "../../Components/UserRegistryPage/UsersTable";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { allUsersState, companyState, userState, errorState } from "../../globalstate";
import { getAllUsers } from "../../Services/users";

const Title = styled.h1`
  font-weight: bold;
  font-size: 48px;
`;

const Container = styled.div`
  background-color: #051622;
  color: #1ba098;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
`;

const Users = () => {
  const [open, setOpen] = useState(false);
  const user = useRecoilValue(userState);
  const company = useRecoilValue(companyState);
  const setUsers = useSetRecoilState(allUsersState);
  const [formError, setFormError] = useRecoilState(errorState);
  const resetError = () => setFormError(errorState);



  const handleOpen = () => {
    setOpen(true);
    resetError()
  };

  const handleClose = () => {
    setOpen(false);
    resetError()
  };

  useEffect(() => {
    async function getUsers() {
      const data = await getAllUsers(company.id);
      setUsers(data);
    }
    getUsers();
  }, []);

  const handleName = (profile) => {
    return profile.firstName + " " + profile.lastName;
  };

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else if (!user.isAdmin) {
    return <Navigate replace to="/announcements" />;
  } else {
    return (
      <Fragment>
        <div>
          <NavBar />
        </div>
        <Container>
          <div>
            <Title>User Registry</Title>
            <div>A general view of all your members in your orginization</div>
          </div>
          <UsersTable handleOpen={handleOpen} handleName={handleName} />
          <Modal open={open} onClose={handleClose}>
            <SignUp setOpen={setOpen} />
          </Modal>
        </Container>
      </Fragment>
    );
  }
};

export default Users;
