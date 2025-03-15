import Login from "../pages/Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

describe("Login form missing fields", () => {

    test("shows error if email field is empty", () => {
        render(
            <MemoryRouter>
                <Login setSessionAvailability={jest.fn()} />
            </MemoryRouter>);

        const email = screen.getByTestId('email');
        const password = screen.getByTestId('password');
        const login = screen.getByTestId('loginButton');
        const validateMessage = screen.getByTestId("loginValidation");


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
)