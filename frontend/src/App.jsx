import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { testBackendConnection } from "./features/projectSlice";

function App() {
  const dispatch = useDispatch();
  const { message, loading, error } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(testBackendConnection());
  }, [dispatch]);

  return (
    <div style={{ padding: "40px", fontSize: "18px" }}>
      <h2>Frontend ↔ Backend Test</h2>

      {loading && <p>Connecting...</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
