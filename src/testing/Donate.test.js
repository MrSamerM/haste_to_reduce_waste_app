import Donate from "../pages/Donate";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => { }); // Mock alert
});

describe("Donate field error", () => {

    test("shows error if address field is empty", () => {
        render(
            <MemoryRouter>
                <Donate />
            </MemoryRouter>);



        const description = screen.getByTestId('descriptionInput');
        const portionSize = screen.getByTestId('portionSizeInput');
        const address = screen.getByTestId('testAddressInput');
        const donate = screen.getByTestId('donateButton');



        fireEvent.change(description, { target: { value: 'Curry' } });
        fireEvent.change(portionSize, { target: { value: '2' } });
        fireEvent.change(address, { target: { value: '' } });


        fireEvent.click(donate);

        expect(window.alert).toHaveBeenCalledWith("You have to add a address");

    });

    test("shows error if description field is empty", () => {
        render(
            <MemoryRouter>
                <Donate />
            </MemoryRouter>);



        const description = screen.getByTestId('descriptionInput');
        const portionSize = screen.getByTestId('portionSizeInput');
        const address = screen.getByTestId('testAddressInput');
        const donate = screen.getByTestId('donateButton');



        fireEvent.change(description, { target: { value: '' } });
        fireEvent.change(portionSize, { target: { value: '2' } });
        fireEvent.change(address, { target: { value: '10 Downing street' } });


        fireEvent.click(donate);

        expect(window.alert).toHaveBeenCalledWith("You have to add a desciption");

    });

    test("shows error if portionSize field is less than 0", () => {
        render(
            <MemoryRouter>
                <Donate />
            </MemoryRouter>);

        const description = screen.getByTestId('descriptionInput');
        const portionSize = screen.getByTestId('portionSizeInput');
        const address = screen.getByTestId('testAddressInput');
        const donate = screen.getByTestId('donateButton');



        fireEvent.change(description, { target: { value: 'Curry' } });
        fireEvent.change(portionSize, { target: { value: 0 } });
        fireEvent.change(address, { target: { value: '10 Downing Street' } });


        fireEvent.click(donate);

        expect(window.alert).toHaveBeenCalledWith("You have to have at least 1 portion size");

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