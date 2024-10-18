import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Test Suite", () => {
  // Requirement 1: Login functionality
  test("allows user to login with correct credentials", () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/login/i));
    expect(screen.getByText(/your diary/i)).toBeInTheDocument();
  });

  // Requirement 2: Create new diary entry
  test("allows user to create a new diary entry", () => {
    render(<App />);
    login();

    fireEvent.change(screen.getByPlaceholderText(/write your diary entry/i), {
      target: { value: "My first entry" },
    });
    fireEvent.change(screen.getByPlaceholderText(/add tags/i), {
      target: { value: "personal" },
    });
    fireEvent.click(screen.getByText(/add entry/i));
    expect(screen.getByText("My first entry")).toBeInTheDocument();
    expect(screen.getByText("Tags: personal")).toBeInTheDocument();
  });

  // Requirement 3: Edit existing diary entry
  test("allows user to edit an existing diary entry", () => {
    render(<App />);
    login();
    createEntry();

    fireEvent.click(screen.getByText(/edit/i));
    fireEvent.change(screen.getByPlaceholderText(/write your diary entry/i), {
      target: { value: "Updated entry" },
    });
    fireEvent.click(screen.getByText(/update entry/i));

    expect(screen.getByText("Updated entry")).toBeInTheDocument();
    expect(screen.queryByText("My first entry")).not.toBeInTheDocument();
  });

  // Requirement 4: Delete diary entry
  test("allows user to delete a diary entry", () => {
    render(<App />);
    login();
    createEntry();

    fireEvent.click(screen.getByText(/delete/i));
    expect(screen.queryByText("My first entry")).not.toBeInTheDocument();
  });

  // Requirement 5: Add multiple tags to a diary entry
  test("allows user to add multiple tags to a diary entry", () => {
    render(<App />);
    login();
    fireEvent.change(screen.getByPlaceholderText(/write your diary entry/i), {
      target: { value: "Entry with tags" },
    });
    fireEvent.change(screen.getByPlaceholderText(/add tags/i), {
      target: { value: "work, personal" },
    });
    fireEvent.click(screen.getByText(/add entry/i));

    expect(screen.getByText("Entry with tags")).toBeInTheDocument();
    expect(screen.getByText("Tags: work, personal")).toBeInTheDocument();
  });

  // Requirement 6: Display all diary entries with tags
  test("displays all diary entries with their tags", () => {
    render(<App />);
    login();
    createEntry();

    expect(screen.getByText("My first entry")).toBeInTheDocument();
    expect(screen.getByText("Tags: personal")).toBeInTheDocument();
  });

  // Requirement 7: Filter diary entries by tags
  test("filters diary entries by selected tags", () => {
    render(<App />);
    login();
    createEntry();

    fireEvent.change(screen.getByPlaceholderText(/filter by tags/i), {
      target: { value: "personal" },
    });
    fireEvent.click(screen.getByText(/filter/i));

    expect(screen.getByText("My first entry")).toBeInTheDocument();
    expect(screen.queryByText("Another entry")).not.toBeInTheDocument(); // Assuming another entry with different tags
  });

  // Requirement 8: Save diary entry as draft
  test("allows user to save an entry as a draft", () => {
    render(<App />);
    login();

    fireEvent.change(screen.getByPlaceholderText(/write your diary entry/i), {
      target: { value: "Draft entry" },
    });
    fireEvent.click(screen.getByText(/save draft/i));
    expect(screen.getByText(/draft/i)).toBeInTheDocument(); // Verify if draft is saved and displayed as draft
  });

  // Requirement 9: View and edit user profile
  test("allows user to view and edit profile", () => {
    render(<App />);
    login();

    fireEvent.click(screen.getByText(/profile/i));
    expect(screen.getByText(/username/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/update username/i), {
      target: { value: "newuser" },
    });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
  });

  // Requirement 10: Log out functionality
  test("allows user to log out", () => {
    render(<App />);
    login();

    fireEvent.click(screen.getByText(/logout/i));
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  // Requirement 11: Save diary entries in local storage
  test("saves diary entries to local storage for offline access", () => {
    render(<App />);
    login();
    createEntry();

    const storedEntries = JSON.parse(localStorage.getItem("diaryEntries"));
    expect(storedEntries.length).toBeGreaterThan(0); // Confirm that entries are saved in local storage
  });

  // Requirement 12: Search diary entries by text
  test("provides a search function to find specific entries by text", () => {
    render(<App />);
    login();
    createEntry();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "first" },
    });
    fireEvent.click(screen.getByText(/search/i));

    expect(screen.getByText("My first entry")).toBeInTheDocument();
  });

  // Helper functions to login and create an entry
  const login = () => {
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/login/i));
  };

  const createEntry = () => {
    fireEvent.change(screen.getByPlaceholderText(/write your diary entry/i), {
      target: { value: "My first entry" },
    });
    fireEvent.change(screen.getByPlaceholderText(/add tags/i), {
      target: { value: "personal" },
    });
    fireEvent.click(screen.getByText(/add entry/i));
  };
});
