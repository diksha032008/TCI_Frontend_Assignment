import axios from "axios";

export const fetchTodoStatus = async(id) => {
    return await axios
        .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
        .then(data => {console.log(data.data); return data.data})
        .catch(error => console.log(error));
};