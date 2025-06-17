// src/main.jsx
// src/main.jsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorBoundary from "./pages/ErrorBoundary"; // <-- import ErrorBoundary

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary> {/* <-- wrap here */}
      <App />
    </ErrorBoundary>
  </Provider>
);
