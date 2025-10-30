import { Route, Routes } from "react-router-dom";
import { Home } from "./app/home";
import Login from "./app/login";
import { Profile } from "./app/profile";
import { Room } from "./app/room";
import { Rooms } from "./app/rooms";
import { AppearanceSettings } from "./app/settings/appearance";
import { GeneralSettings } from "./app/settings/general";
import { LayoutSettings } from "./app/settings/layout";
import Signup from "./app/signup";
import { LoggedRoutes } from "./components/loggedRoutes";
import MainLayout from "./components/mainLayout";
import Rules from "./app/rules";
function App() {
  return (
    <Routes>
      <Route element={<LoggedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<LayoutSettings />}>
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route
              path="/settings/appearance"
              element={<AppearanceSettings />}
            />
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
