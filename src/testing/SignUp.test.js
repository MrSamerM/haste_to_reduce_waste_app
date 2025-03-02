import Signup from "../pages/SignUp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

// learnt how to use testing library by experimenting with chatgpt, and learning different methods

// describe("Sign up form missing fields", () => {

//     test("shows error if all fields are empty", () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>);

//         fireEvent.click(screen.getByTestId("signup"));

//         expect(screen.getByTestId("validateMessage").textContent).toBe("Must input all details");
//     });



//     test("shows error if name field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>);

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');
//         const validateMessage = screen.getByTestId("validateMessage");


//         fireEvent.change(name, { target: { value: '' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'password' } });


//         fireEvent.click(signup);

//         expect(validateMessage.textContent).toBe("Must input all details");
//     });


//     test("shows error if email field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>);

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');
//         const validateMessage = screen.getByTestId("validateMessage");


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
//         fireEvent.change(email, { target: { value: '' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(signup);

//         expect(validateMessage.textContent).toBe("Must input all details");
//     });
// }
// );


// describe("password less than or equal to 6", () => {
//     test("shows error if password is not of length <= 6", async () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'pass' } });

//         fireEvent.click(signup);

//         await waitFor(() => {
//             expect(screen.getByTestId("validateMessage").textContent).toBe("Must have a longer password");
//         });
//     });
// });

// describe("incorrect email format", () => {
//     test("shows error if email format is not correct", async () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam.com@brunel' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(signup);

//         await waitFor(() => {
//             expect(screen.getByTestId("validateMessage").textContent).toBe("Must have a valid email");
//         });
//     });
// });

// describe("age of user less than 18", () => {
//     test("shows error if user is less than 18", async () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2015-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(signup);

//         await waitFor(() => {
//             expect(screen.getByTestId("validateMessage").textContent).toBe("Must be 18 or above");
//         });
//     });
// });

// describe("All fields correctly filled, and email unique", () => {
//     test("consoles, signed up", async () => {
//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2015-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(signup);

//         await waitFor(() => {
//             expect(screen.getByTestId("validateMessage").textContent).toBe("Must be 18 or above");
//         });
//     });
// });


jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// describe("check if email is unique", () => {
//     test("navigates to home page on success", async () => {

//         axios.post.mockResolvedValue({ data: { userID: "U1234j303jdodp" } });

//         render(
//             <MemoryRouter>
//                 <Signup setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );

//         const name = screen.getByTestId('name');;
//         const surname = screen.getByTestId('surname');
//         const dateOfBirth = screen.getByTestId('dateOfBirth');
//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const signup = screen.getByTestId('signup');


//         fireEvent.change(name, { target: { value: 'Sam' } });
//         fireEvent.change(surname, { target: { value: 'hhey' } });
//         fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(signup);

//         await waitFor(() => {
//             expect(mockNavigate).toHaveBeenCalledWith("/");
//         });

//         expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/register", {
//             name: "Sam",
//             surname: "hhey",
//             dateOfBirth: "2002-09-10",
//             email: "sam@gmail.com",
//             password: "password",
//         });
//     });
// });

describe("check if email is not unique", () => {
    test("error message for not unique", async () => {

        axios.post.mockRejectedValue({
            response: { status: 400, data: { error: "There appears to be a error with the input" } }
        });

        render(
            <MemoryRouter>
                <Signup setSessionAvailability={jest.fn()} />
            </MemoryRouter>
        );

        const name = screen.getByTestId('name');;
        const surname = screen.getByTestId('surname');
        const dateOfBirth = screen.getByTestId('dateOfBirth');
        const email = screen.getByTestId('email');
        const password = screen.getByTestId('password');
        const signup = screen.getByTestId('signup');


        fireEvent.change(name, { target: { value: 'Sam' } });
        fireEvent.change(surname, { target: { value: 'hhey' } });
        fireEvent.change(dateOfBirth, { target: { value: '2002-09-10' } });
        fireEvent.change(email, { target: { value: 'email@gmail.com' } });
        fireEvent.change(password, { target: { value: 'password' } });

        fireEvent.click(signup);

        await waitFor(() => {
            expect(screen.getByTestId("validateMessage")).toHaveTextContent("This email has already been used");
        });


        expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/register", {
            name: "Sam",
            surname: "hhey",
            dateOfBirth: "2002-09-10",
            email: "email@gmail.com",
            password: "password",
        });

    });
});
