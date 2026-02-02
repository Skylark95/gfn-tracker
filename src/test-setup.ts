import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, afterEach } from "bun:test";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});