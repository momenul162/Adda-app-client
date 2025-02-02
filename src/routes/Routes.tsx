import MainLayout from "@/layout/Main";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found/NotFount";
import Register from "@/pages/Register";
import Post from "@/pages/searched-post";
import Videos from "@/pages/Videos";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes;
