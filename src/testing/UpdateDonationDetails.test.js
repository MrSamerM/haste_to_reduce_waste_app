import UpdateDonationDetails from "../pages/UpdateDonationDetails";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useNavigate } from "react-router-dom";

// learnt how to use testing library by experimenting with chatgpt, and learning different methods. SO I used it to undertand different fireevent rules
// OpenAI. (2025). ChatGPT ( 25 March Version) [Large Language Model]. Available at: https://chatgpt.com/ (Accessed: 25 March 2025).


// describe("Update Donation field error", () => {

//     test("shows error if address field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <UpdateDonationDetails />
//             </MemoryRouter>);



//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('updateDonation');



//         fireEvent.change(description, { target: { value: 'Salad' } });
//         fireEvent.change(portionSize, { target: { value: 2 } });
//         fireEvent.change(address, { target: { value: '' } });

//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to add a address");

//     });

//     test("shows error if description field is empty", () => {
//         render(
//             <MemoryRouter>
//                 <UpdateDonationDetails />
//             </MemoryRouter>);



//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('updateDonation');



//         fireEvent.change(description, { target: { value: '' } });
//         fireEvent.change(portionSize, { target: { value: 2 } });
//         fireEvent.change(address, { target: { value: '11 Downing street' } });


//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to add a desciption");

//     });

//     test("shows error if portionSize field is less than 0", () => {
//         render(
//             <MemoryRouter>
//                 <UpdateDonationDetails />
//             </MemoryRouter>);

//         const description = screen.getByTestId('descriptionInput');
//         const portionSize = screen.getByTestId('portionSizeInput');
//         const address = screen.getByTestId('testAddressInput');
//         const donate = screen.getByTestId('updateDonation');



//         fireEvent.change(description, { target: { value: 'Salad' } });
//         fireEvent.change(portionSize, { target: { value: -5 } });
//         fireEvent.change(address, { target: { value: '11 Downing Street' } });


//         fireEvent.click(donate);

//         expect(window.alert).toHaveBeenCalledWith("You have to have at least 1 portion size");

//     });
// }
// );

beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => { });
});
jest.mock("axios");

describe("check if all inputs are correct", () => {
    test("Pop up success message", async () => {
        axios.post.mockResolvedValue({ data: { message: "Updated" } });

        render(
            <MemoryRouter>
                <UpdateDonationDetails />
            </MemoryRouter>
        );

        const description = screen.getByTestId("descriptionInput");
        const portionSize = screen.getByTestId("portionSizeInput");
        const addressInput = screen.getByTestId("testAddressInput");
        const update = screen.getByTestId("updateDonation");



        fireEvent.change(description, { target: { value: "Salad" } });
        fireEvent.change(portionSize, { target: { value: 2 } });
        fireEvent.change(addressInput, { target: { value: "11 Downing Street" } });


        fireEvent.click(update);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/updateDonation", {
                donationId: 'hu3649373u',
                image: "image.png/base64String",
                description: "Salad",
                portionSize: '2',
                address: "11 Downing Street",
                longitude: 0,
                latitude: 0

            });

            expect(window.alert).toHaveBeenCalledWith("The update has been made");
        });

    });
});
