import Signup from "../pages/SignUp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// learnt how to use testing library by experimenting with chatgpt, and learning different methods


jest.mock("axios");

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


describe("password less than or equal to 6", () => {
    test("shows error if password is not of length <= 6", async () => {
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
        fireEvent.change(email, { target: { value: 'sam@gmail.com' } });
        fireEvent.change(password, { target: { value: 'pass' } });

        fireEvent.click(signup);

        await waitFor(() => {
            expect(screen.getByTestId("validateMessage").textContent).toBe("Must have a longer password");
        });
    });
});
