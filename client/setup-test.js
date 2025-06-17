// setup-test.js
import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for React Router compatibility
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
