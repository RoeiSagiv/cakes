import "../index.css";

const range = length => {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (arr, i) => {
    return {
        firstName: arr[i].firstName,
        lastName: arr[i].lastName,
        id: arr[i].id,
        role: arr[i].role,
    };
};

export function makeData(len, usersArr) {
    return range(usersArr.length).map(i => {
        return {
            ...newPerson(usersArr, i),
            children: range(0).map(newPerson)
        };
    });
}
