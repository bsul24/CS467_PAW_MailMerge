import React from "react";
import Papa from "papaparse";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CSVUploader from "../../components/CSVUploader";

test("renders CSVUploader component", () => {
  const { getByRole } = render(<CSVUploader onDataParsed={() => {}} />);
  expect(
    getByRole("heading", { name: /upload csv file/i })
  ).toBeInTheDocument();
});

test("handles valid CSV file upload and parses data", async () => {
  const onDataParsed = jest.fn();
  const { getByLabelText } = render(
    <CSVUploader onDataParsed={onDataParsed} />
  );
  const file = new File(["col1,col2\nval1,val2"], "test.csv", {
    type: "text/csv",
  });

  const input = getByLabelText("Upload CSV File");
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(onDataParsed).toHaveBeenCalledWith({
      data: [{ col1: "val1", col2: "val2" }],
      headers: ["col1", "col2"],
    });
  });
});

test("displays error message for non-CSV file upload", async () => {
  const { getByLabelText, getByText } = render(
    <CSVUploader onDataParsed={() => {}} />
  );
  const file = new File(["invalid content"], "test.txt", {
    type: "text/plain",
  });

  const input = getByLabelText("Upload CSV File");
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(getByText(/please upload a valid csv file/i)).toBeInTheDocument();
  });
});

test("displays error message if CSV parsing fails", async () => {
  const parseSpy = jest
    .spyOn(Papa, "parse")
    .mockImplementation((file, options) => {
      options.error({ message: "Simulated parsing error" });
    });

  const { getByLabelText, getByTestId } = render(
    <CSVUploader onDataParsed={() => {}} />
  );
  const file = new File(["invalid content"], "test.csv", { type: "text/csv" });

  const input = getByLabelText("Upload CSV File");
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(getByTestId("error-message")).toHaveTextContent(
      "Error parsing CSV: Simulated parsing error"
    );
  });

  parseSpy.mockRestore();
});
