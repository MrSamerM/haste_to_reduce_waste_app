import Login from "../pages/Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

// learnt how to use testing library by experimenting with chatgpt, and learning different methods. SO I used it to undertand different fireevent rules
// OpenAI. (2025). ChatGPT ( 25 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 25 March 2025).

// describe("Login form missing fields", () => {

//     test("shows error if email field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Login setSessionAvailability={jest.fn()} />
//             </MemoryRouter>);

//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const login = screen.getByTestId('loginButton');
//         const validateMessage = screen.getByTestId("loginValidation");


//         fireEvent.change(email, { target: { value: '' } });
//         fireEvent.change(password, { target: { value: 'password' } });


//         fireEvent.click(login);

//         expect(validateMessage.textContent).toBe("You must input an email and a password");

//     });

//     test("shows error if password field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Login setSessionAvailability={jest.fn()} />
//             </MemoryRouter>);

//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const login = screen.getByTestId('loginButton');
//         const validateMessage = screen.getByTestId("loginValidation");


//         fireEvent.change(email, { target: { value: 'email@gmail.com' } });
//         fireEvent.change(password, { target: { value: '' } });


//         fireEvent.click(login);

//         expect(validateMessage.textContent).toBe("You must input an email and a password");

//     });
// }
// );

jest.mock("axios");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// describe("check if email and password is correct", () => {
//     test("navigates to home page on success", async () => {

//         axios.post.mockResolvedValue({ data: { userID: "U1234j303jdodp" } });

//         render(
//             <MemoryRouter>
//                 <Login setSessionAvailability={jest.fn()} />
//             </MemoryRouter>
//         );


//         const email = screen.getByTestId('email');
//         const password = screen.getByTestId('password');
//         const login = screen.getByTestId('loginButton');



//         fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
//         fireEvent.change(password, { target: { value: 'password' } });

//         fireEvent.click(login);

//         await waitFor(() => {
//             expect(mockNavigate).toHaveBeenCalledWith("/");
//         });

//         expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/login", {
//             email: "sam@gmail.com",
//             password: "password",
//         });
//     });
// });

describe("check if email or password is incorrect", () => {
    test("if error message will be displayed if any are incorrect", async () => {

        axios.post.mockRejectedValue({
            response: { status: 400, data: { message: "This is a not a user", validate: false } }
        });

        render(
            <MemoryRouter>
                <Login setSessionAvailability={jest.fn()} />
            </MemoryRouter>
        );


        const email = screen.getByTestId('email');
        const password = screen.getByTestId('password');
        const login = screen.getByTestId('loginButton');



        fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
        fireEvent.change(password, { target: { value: 'passwords' } });

        fireEvent.click(login);

        await waitFor(() => {
            expect(screen.getByTestId("loginValidation")).toHaveTextContent("The email or password is incorrect");
        });

        expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/login", {
            email: "sam@gmail.com",
            password: "passwords",
        });
    });
});