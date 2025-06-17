// src/__tests__/Home.test.js
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Home from "../pages/Home";
import roomReducer from "../features/roomSlice";

// Mock dependencies
jest.mock("../socket", () => ({
  emit: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Home Component - Comprehensive Test", () => {
  let store;
  let user;
  
  // Define the validation messages
  const ROOM_NAME_VALIDATION_MSG = 
    "Room name must be 5-20 characters, max 3 digits, not only numbers, and no special characters";
  const NAME_VALIDATION_MSG = "Name must be at least 5 characters";

  beforeEach(() => {
    store = configureStore({
      reducer: {
        room: roomReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    user = userEvent.setup();
    mockNavigate.mockClear();
    jest.clearAllMocks();
    
    // Mock alert globally
    window.alert = jest.fn();
  });

const fillForm = async (roomName, userName) => {
  const roomInput = screen.getByPlaceholderText(/sprint poker/i);
  const nameInput = screen.getByPlaceholderText(/antonio/i);

  if (roomName !== undefined) {
    await user.clear(roomInput);
    await user.type(roomInput, roomName);
  }

  if (userName !== undefined) {
    await user.clear(nameInput);
    await user.type(nameInput, userName);
  }
};


  // =====================
  // ROOM NAME VALIDATION
  // =====================
  
  test("shows alert when roomName is too short", async () => {
    await fillForm("abc", "Antonio");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
  });

  test("shows alert when roomName has too many digits", async () => {
    await fillForm("room1234", "Antonio");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
  });

  test("allows valid room names with exactly 3 digits", async () => {
    await fillForm("room123", "Antonio");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(window.alert).not.toHaveBeenCalled();
  });

  test("shows alert when roomName has special characters", async () => {
    await fillForm("room$#@!", "Antonio");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
  });

  // =====================
  // USER NAME VALIDATION
  // =====================
  
  describe("Name field validation", () => {
// test("shows error when name is empty", async () => {
//   await fillForm("ValidRoom", "");
//   await user.click(screen.getByRole("button", { name: /create room/i }));
  
//   const errorElement = await screen.findByText("Please enter your name");
//   expect(errorElement).toBeInTheDocument();
//   expect(window.alert).not.toHaveBeenCalled();
// });
    test("shows error when name is too short (1 character)", async () => {
      await fillForm("ValidRoom", "A");
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Use findByText to wait for error message
      const errorElement = await screen.findByText(NAME_VALIDATION_MSG);
      expect(errorElement).toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
    });

    test("shows error when name is too short (2 characters)", async () => {
      await fillForm("ValidRoom", "An");
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Use findByText to wait for error message
      const errorElement = await screen.findByText(NAME_VALIDATION_MSG);
      expect(errorElement).toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
    });

    test("shows error when name is too short (4 characters)", async () => {
      await fillForm("ValidRoom", "Anto");
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Use findByText to wait for error message
      const errorElement = await screen.findByText(NAME_VALIDATION_MSG);
      expect(errorElement).toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
    });

    test("allows name with 5 characters", async () => {
      await fillForm("ValidRoom", "Anton");
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Use queryByText since error should not appear
      const errorElement = screen.queryByText(NAME_VALIDATION_MSG);
      expect(errorElement).not.toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
    });

    test("shows error when name is only whitespace", async () => {
      await fillForm("ValidRoom", "   ");
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Use findByText to wait for error message
      const errorElement = await screen.findByText("Please enter your name");
      expect(errorElement).toBeInTheDocument();
    });

    test("clears error when user starts typing", async () => {
      await fillForm("ValidRoom", "Anto"); // 4 characters - invalid
      await user.click(screen.getByRole("button", { name: /create room/i }));
      
      // Verify error is shown
      const errorElement = await screen.findByText(NAME_VALIDATION_MSG);
      expect(errorElement).toBeInTheDocument();
      
      // Start typing in the name field
      const nameInput = screen.getByPlaceholderText(/antonio/i);
      await user.type(nameInput, "n"); // Makes it "Anton" (5 characters)
      
      // Verify error is cleared
      await waitFor(() => {
        expect(screen.queryByText(NAME_VALIDATION_MSG)).not.toBeInTheDocument();
      });
    });
  });

  // =====================
  // FUNCTIONALITY TESTS
  // =====================
  
  test("updates Redux state correctly on valid submit", async () => {
    await fillForm("Project Alpha", "Maria");
    await user.click(screen.getByRole("button", { name: /create room/i }));

    const state = store.getState().room;
    expect(state.roomName).toBe("Project Alpha");
    expect(state.user.name).toBe("Maria");
    expect(state.user.role).toBe("player");
    expect(state.roomId).toMatch(/^[\w-]{21}$/);
  });

  test("emits socket event with correct payload", async () => {
    await fillForm("Valid Room", "Antonio");
    await user.click(screen.getByRole("button", { name: /create room/i }));

    const { emit } = require("../socket");
    const emitCall = emit.mock.calls[0];

    expect(emitCall[0]).toBe("createRoom");
    expect(emitCall[1].roomName).toBe("Valid Room");
    expect(emitCall[1].user.name).toBe("Antonio");
    expect(emitCall[1].user.role).toBe("player");
    expect(emitCall[1].roomId).toMatch(/^[\w-]{21}$/);
  });

 test("navigates to room page on success", async () => {
  await fillForm("Navigation Test", "ValidUser");
  await user.click(screen.getByRole("button", { name: /create room/i }));

  // Wait for socket emission
  const { emit } = require("../socket");
  await waitFor(() => {
    expect(emit).toHaveBeenCalled();
  });
  
  const roomId = emit.mock.calls[0][1].roomId;
  expect(mockNavigate).toHaveBeenCalledWith(`/room/${roomId}`);
});

  test("sets spectator role correctly", async () => {
    // Select role first
    await user.selectOptions(screen.getByLabelText(/role/i), "spectator");
    
    // Then fill form
    await fillForm("Observer Room", "Watcher");
    await user.click(screen.getByRole("button", { name: /create room/i }));

    const state = store.getState().room;
    expect(state.user.role).toBe("spectator");

    const { emit } = require("../socket");
    expect(emit.mock.calls[0][1].user.role).toBe("spectator");
  });

  // =====================
  // EDGE CASE TESTS
  // =====================
  
// test("shows alert when roomName is empty", async () => {
//   await fillForm("", "ValidNameWith5Chars"); // Valid 5+ char name
//   await user.click(screen.getByRole("button", { name: /create room/i }));
  
//   await waitFor(() => {
//     expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
//   });
// });

  test("shows alert when roomName is only numbers", async () => {
    await fillForm("12345", "Valid Name");
    await user.click(screen.getByRole("button", { name: /create room/i }));
    expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
  });

  test("emits spectator role in socket event", async () => {
    // Select role first
    await user.selectOptions(screen.getByLabelText(/role/i), "spectator");
    
    // Then fill form
    await fillForm("Spectator Room", "Observer");
    await user.click(screen.getByRole("button", { name: /create room/i }));

    const { emit } = require("../socket");
    expect(emit.mock.calls[0][1].user.role).toBe("spectator");
  });

    // =====================
    // PARAMETERIZED TESTS
    // =====================

 describe("Room name validation edge cases", () => {
    const testCases = [
      { input: "12345", description: "only numbers" },
      { input: "dev$team", description: "special characters" },
      { input: "     ", description: "whitespace only" },
      { input: "abc", description: "too short" },
      { input: "thisnameiswaytoolongforthisform", description: "too long" },  
      { input: "1234a", description: "too many digits" },
    ];

    test.each(testCases)(
      "shows alert for $description",
      async ({ input, userName = "Valid Name" }) => {  // Default name
        await fillForm(input, userName);
        await user.click(screen.getByRole("button", { name: /create room/i }));
        
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith(ROOM_NAME_VALIDATION_MSG);
        });
      }
    );
  });

  describe("Valid room name cases", () => {
   const testCases = [
  { input: "valid123", description: "exactly 3 digits" },
  { input: "properroom", description: "no digits, all letters" },
  { input: "teamvelocity", description: "letters only, no spaces or special chars" },
  { input: "releaseplan", description: "11 characters" },
  { input: "a".repeat(20), description: "exactly 20 characters" },
];


    test.each(testCases)(
      "allows $description",
      async ({ input }) => {
        await fillForm(input, "ValidNameWith5Chars");
        await user.click(screen.getByRole("button", { name: /create room/i }));
        
        await waitFor(() => {
          expect(window.alert).not.toHaveBeenCalled();
        });
      }
    );
  });
});
// Top-Level Tests (9)
// Shows alert when roomName is too short
// Tests that an alert appears for room names <5 characters.

// Updates Redux state correctly on valid submit
// Verifies Redux state updates with correct room/user data after submission.

// Emits socket event with correct payload
// Ensures 'createRoom' socket event emits with proper room/user data.

// Navigates to room page on success
// Checks navigation to room page after successful room creation.

// Sets spectator role correctly
// Confirms spectator role is properly set in state and socket payload.

// Shows alert when roomName is empty
// Tests alert display when room name field is empty.

// Shows alert when roomName is only numbers
// Verifies alert appears for room names containing only digits.

// Shows alert when roomName contains special characters
// Checks alert display for names with special characters ($, @, etc.).

// Emits spectator role in socket event
// Ensures socket payload includes spectator role when selected.

// Nested Validation Tests (5)
// Shows alert for only numbers
// Parameterized test for numeric-only room names.

// Shows alert for special characters
// Parameterized test for names with special characters.

// Shows alert for whitespace only
// Tests names consisting only of whitespace characters.

// Shows alert for too short
// Parameterized test for short names (<5 chars).

// Shows alert for empty
// Parameterized test for empty name field.
