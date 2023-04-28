import React, { Fragment } from "react";
import {
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import { allUsersState } from "../../globalstate";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#DEB992",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: "#DEB992 solid 1px",
}));

const UsersTable = (props) => {
  const { handleOpen, handleName } = props;

  const users = useRecoilValue(allUsersState);

  return (
    <Fragment>
      <TableContainer
        style={{
          width: "80vw",
          border: "#DEB992 solid 1px",
          borderRadius: "5px",
          marginTop: "50px",
          marginBottom: "50px",
          color: "#DEB992",
        }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ border: "#DEB992 solid 1px" }}>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Active</StyledTableCell>
              <StyledTableCell>Admin</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.name}>
                <StyledTableCell>{handleName(user.profile)}</StyledTableCell>
                <StyledTableCell>{user.profile.email}</StyledTableCell>
                {user.active === true ? (
                  <StyledTableCell style={{ color: "#00B11c" }}>
                    {"YES"}
                  </StyledTableCell>
                ) : (
                  <StyledTableCell style={{ color: "#FF0000" }}>
                    {"NO"}
                  </StyledTableCell>
                )}

                {user.admin === true ? (
                  <StyledTableCell style={{ color: "#00B11c" }}>
                    {"YES"}
                  </StyledTableCell>
                ) : (
                  <StyledTableCell style={{ color: "#FF0000" }}>
                    {"NO"}
                  </StyledTableCell>
                )}

                <StyledTableCell>{user.status}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        style={{ background: "#1BA098", borderRadius: "15px" }}
        onClick={() => {
          handleOpen();
        }}
      >
        Add User
      </Button>
    </Fragment>
  );
};

export default UsersTable;
