import React, { useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import { fetchTodoStatus } from "../../services/todoListSvc";

const TodoList = () => {
  const [groups, setGroups] = useState([{ start: "", end: "" }]);
  const [formError, setFormError] = useState({ isError: false, message: "" });
  const [statusData, setStatusData] = useState([]);

  const addGroup = () => {
    const newGroup = { start: "", end: "" };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (index) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };

  const setGroupStart = (event, index) => {
    const updatedGroups = [...groups];
    updatedGroups[index].start = Number(event.target.value);
    setGroups(updatedGroups);
  };

  const setGroupEnd = (event, index) => {
    const updatedGroups = [...groups];
    updatedGroups[index].end = Number(event.target.value);
    setGroups(updatedGroups);
  };

  const validate = () => {
    let isError = false;
    let message = "";

    if (groups[0].start !== 1 || groups[groups.length - 1].end !== 10) {
      isError = true;
      message = `Please enter valid data (start of first group: 1, end of last group: 10)`;
      setFormError({ isError, message });
      return false;
    }

    groups.forEach((group, index) => {
      if (
        group.start < 1 ||
        group.end > 10 ||
        group.start > group.end
      ) {
        isError = true;
        message = `Group ${index + 1} has invalid data`;
        setFormError({ isError, message });
        return false;
      }

      if (index > 0 && group.start !== groups[index - 1].end + 1) {
        isError = true;
        message = `Group ${index + 1} has gap`;
        setFormError({ isError, message });
        return false;
      }
    });

    setFormError({ isError, message });
    return !isError;
  };


  const handleSubmit = async () => {
    if (!validate()) return;

    const todoStatusData = [];

    for (const group of groups) {
      const status = [];
      for (let id = group.start; id <= group.end; id++) {
        const data = await fetchTodoStatus(id); 
        status.push(data);
      }
      todoStatusData.push(status);
    }

    const statusStrings = todoStatusData.map((status) => {
      let todoString = "";
      status.forEach((t, i) => {
        todoString += `(${t.id}) ${t.completed}`;
        if (i !== status.length - 1) {
          todoString += ", ";
        }
      });
      return todoString;
    });

    setStatusData(statusStrings);
  };

  return (
    <>
      {groups.map((group, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Button onClick={() => deleteGroup(index)}>Delete Group</Button>
          <Typography variant="body1">Group {index + 1}</Typography>
          <TextField
            sx={{ width: "80px" }}
            value={group.start}
            onChange={(e) => setGroupStart(e, index)}
            label="From"
            inputProps={{ type: "number" }}
          />
          <TextField
            sx={{ width: "80px" }}
            value={group.end}
            onChange={(e) => setGroupEnd(e, index)}
            label="To"
            inputProps={{ type: "number" }}
          />
          <TextField sx={{ width: "750px" }}
            value={statusData[index]} 
            disabled
          />
        </Box>
      ))}

      <Box>
        {formError.isError && (
          <Typography variant="body2" sx={{ color: "red" }}>
            {formError.message}
          </Typography>
        )}
      </Box>

      <Box>
        <Button onClick={addGroup}>Add Group</Button>
      </Box>

      <Box>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>

      {statusData.map((statusArr, index) => (
        <pre key={index}>{JSON.stringify(statusArr, undefined, 4)}</pre>
      ))}
    </>
  );
};

export default TodoList;
