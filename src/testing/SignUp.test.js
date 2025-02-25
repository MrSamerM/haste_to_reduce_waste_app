import Signup from "../pages/SignUp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";  // Import MemoryRouter


jest.mock("axios");

describe("Form Component", () => {
    test("shows error if fields are empty", () => {
        render(
            <MemoryRouter>
                <Signup setSessionAvailability={jest.fn()} />
            </MemoryRouter>);

        fireEvent.click(screen.getByTestId("signup"));

        expect(screen.getByTestId("validateMessage").textContent).toBe("Must input all details");
    });
}
)