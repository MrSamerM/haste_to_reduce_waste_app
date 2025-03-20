import Donate from "../pages/Donate";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";


beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => { }); // Mock alert
});

// describe("Donate field error", () => {

//     test("shows error if address field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Donate />
//             </MemoryRouter>);



//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('donateButton');



//         fireEvent.change(description, { target: { value: 'Curry' } });
//         fireEvent.change(portionSize, { target: { value: 2 } });
//         fireEvent.change(address, { target: { value: '' } });

//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to add a address");

//     });

//     test("shows error if description field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <Donate />
//             </MemoryRouter>);



//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('donateButton');



//         fireEvent.change(description, { target: { value: '' } });
//         fireEvent.change(portionSize, { target: { value: 2 } });
//         fireEvent.change(address, { target: { value: '10 Downing street' } });


//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to add a desciption");

//     });

//     test("shows error if portionSize field is less than 0", () => {
//         render(
//             <MemoryRouter>
//                 <Donate />
//             </MemoryRouter>);

//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('donateButton');



//         fireEvent.change(description, { target: { value: 'Curry' } });
//         fireEvent.change(portionSize, { target: { value: 0 } });
//         fireEvent.change(address, { target: { value: '10 Downing Street' } });


//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to have at least 1 portion size");

//     });
// }
// );

jest.mock("axios");

describe("check if all inputs are correct", () => {
    test("Pop up success message", async () => {
        axios.post.mockResolvedValue({ data: { message: "Donated" } });

        render(
            <MemoryRouter>
                <Donate />
            </MemoryRouter>
        );

        const description = screen.getByTestId("descriptionInput");
        const portionSize = screen.getByTestId("portionSizeInput");
        const addressInput = screen.getByTestId("testAddressInput");
        const donateButton = screen.getByTestId("donateButton");



        fireEvent.change(description, { target: { value: "Curry" } });
        fireEvent.change(portionSize, { target: { value: 1 } });
        fireEvent.change(addressInput, { target: { value: "10 Downing Street" } });


        fireEvent.click(donateButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/donate", {
                image: "image.png/base64String",
                description: "Curry",
                portionSize: '1',
                address: "10 Downing Street",
                longitude: 0,
                latitude: 0
            });

            expect(window.alert).toHaveBeenCalledWith("The donation has been made");
        });

    });
});
