import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import ProtectedRoute from "./components/protected-route";
import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/PostJobs";
import JobListing from "./pages/job-listing";
import MyJobs from "./pages/my_jobs";
import JobPage from "./pages/job";
import SavedJobs from "./pages/SavedJobs";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./App.css";

// ✅ Added future flags to createBrowserRouter for v7 readiness
const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        { path: "/", element: <LandingPage /> },
        {
          path: "/onboarding",
          element: (
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          ),
        },
        {
          path: "/jobs",
          element: (
            <ProtectedRoute>
              <JobListing />
            </ProtectedRoute>
          ),
        },
        {
          path: "/post-job",
          element: (
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-jobs",
          element: (
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/saved-jobs",
          element: (
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/job/:id",
          element: (
            <ProtectedRoute>
              <JobPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  {
    // 👇 Add recommended future flags to silence warnings and prepare for v7
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
    },
  }
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </ThemeProvider>
  );
}

export default App;
