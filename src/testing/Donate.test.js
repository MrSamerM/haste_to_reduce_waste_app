import Login from "../pages/Donate";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

describe("Login form missing fields", () => {

    test("shows error if email field is empty", () => {
        render(
            <MemoryRouter>
                <Donate setSessionAvailability={jest.fn()} />
            </MemoryRouter>);



        const description = screen.getByTestId('description');
        const portionSize = screen.getByTestId('portionSize');
        const address = screen.getByTestId('address');
        const login = screen.getByTestId('loginButton');



        fireEvent.change(email, { target: { value: '' } });
        fireEvent.change(password, { target: { value: 'password' } });


        fireEvent.click(login);

        expect(validateMessage.textContent).toBe("You must input an email and a password");

    });

    test("shows error if password field is empty", () => {
        render(
            <MemoryRouter>
                <Login setSessionAvailability={jest.fn()} />
            </MemoryRouter>);

        const email = screen.getByTestId('email');
        const password = screen.getByTestId('password');
        const login = screen.getByTestId('loginButton');
        const validateMessage = screen.getByTestId("loginValidation");


        fireEvent.change(email, { target: { value: 'email@gmail.com' } });
        fireEvent.change(password, { target: { value: '' } });


        fireEvent.click(login);

        expect(validateMessage.textContent).toBe("You must input an email and a password");

    });
}
);

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