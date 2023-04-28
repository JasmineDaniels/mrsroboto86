import React, { Fragment, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { allUsersState, companyState, errorState } from "../../globalstate";
import { createUser } from "../../Services/users";

const Form = styled.div`
  background: #051622;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  color: #deb992;
`;

const Title = styled.h1`
  font-weight: bold;
  margin: 0;
  font-size: 25px;
  padding: 10px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #deb992;
  padding: 7px 15px;
  margin: 5px 0;
  width: ${({ w }) => w};
  color: #deb992;

  &::placeholder {
    color: #deb992;
  }
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background: #1ba098;
  border-radius: 10.2875px;
  border: 1px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 45px;
  font-weight: bold;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 25px;
`;

const StyledModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.6s ease-in-out;
  text-align: center;
  z-index: 100;
  width: 50%;
  height: 70%;
`;

const StyledSelect = styled.select`
  text-align: center;
  height: 40%;
  width: 60%;
  border-radius: 15px;
  color: #5533ff;
  font-weight: bold;
`;

const StyledDiv = styled.div``;

const SignUp = (props) => {
  const { setOpen } = props;
  const options = ["False", "True"];

  const company = useRecoilValue(companyState);
  const [users, setUsers] = useRecoilState(allUsersState);
  const [userIsAdmin, setUserIsAdmin] = useState();
  const [formError, setFormError] = useRecoilState(errorState);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetError = () => setFormError(errorState);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  const formIsValid = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      setFormError({
        ...formError,
        isError: true,
        message: "All fields are required",
      });
      return false;
    } else if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setFormError({
        ...formError,
        isError: true,
        message: "Email must be in correct format",
        field: "email",
      });
      return false;
    } else if (!phone.match(/\(\d{3}\)\s*\d{3}-\d{4}/)) {
      setFormError({
        ...formError,
        isError: true,
        message: "Phone number must be in correct format",
        field: "phone",
      });
      return false;
    } else if (password !== confirmPassword) {
      setFormError({
        ...formError,
        isError: true,
        message: "Passwords doen't match",
        field: "password",
      });
      return false;
    } else if (userIsAdmin === null) {
      setFormError({
        ...formError,
        isError: true,
        message: "You need to pick an option for admin",
      });
    }
    return true;
  };

  const handleSignUp = async () => {
    if (formIsValid()) {
      await createUser(company.id, {
        credentials: {
          username: username,
          password: password,
        },
        profile: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        },
        admin: userIsAdmin,
      })
        .then((data) => {
          setUsers([...users, data]);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setOpen(false);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSelect = (event) => {
    event.target.value === "False"
      ? setUserIsAdmin(false)
      : setUserIsAdmin(true);
  };

  return (
    <StyledModal>
      <Form>
        <StyledDiv onKeyPress={handleKeyPress}>
          <Input
            placeholder="First Name"
            type="text"
            w={"170px"}
            style={{ margin: "10px" }}
            onChange={(e) => {
              setFirstName(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
          <Input
            placeholder="Last Name"
            type="text"
            w={"170px"}
            style={{ margin: "10px" }}
            onChange={(e) => {
              setLastName(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
        </StyledDiv>
        <Fragment>
          <Input
            placeholder="Email"
            type="text"
            w={"390px}"}
            onChange={(e) => {
              setEmail(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
        </Fragment>
        <Fragment>
          <Input
            placeholder="Phone"
            type="tel"
            w={"390px}"}
            onChange={(e) => {
              setPhone(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
        </Fragment>
        <Fragment>
          <Input
            placeholder="Username"
            type="text"
            w={"390px}"}
            onChange={(e) => {
              setUsername(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
        </Fragment>
        <StyledDiv>
          <Input
            placeholder="Password"
            type="password"
            w={"170px"}
            style={{ margin: "10px" }}
            onChange={(e) => {
              setPassword(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
          <Input
            placeholder="Confirm password"
            type="password"
            w={"170px"}
            style={{ margin: "10px" }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              resetError();
            }}
            onKeyPress={handleKeyPress}
          />
        </StyledDiv>

        <div style={{ margin: "25px" }}>
          <Title>Make user an admin role?</Title>
          <StyledSelect onChange={handleSelect} onKeyPress={handleKeyPress}>
            {options.map((option, index) => {
              return <option key={index}>{option}</option>;
            })}
          </StyledSelect>
        </div>

        <Button onClick={handleSignUp}>Sign Up</Button>

        {formError.isError && !formError.field ? (
          <p
            style={{
              color: "red",
              width: "100%",
              textAlign: "center",
            }}
          >
            {formError.message}
          </p>
        ) : formError.isError && formError.field ? (
          <p
            style={{
              color: "red",
              width: "100%",
              textAlign: "center",
            }}
          >
            {formError.message}
          </p>
        ) : (
          ""
        )}
      </Form>
    </StyledModal>
  );
};

export default SignUp;
