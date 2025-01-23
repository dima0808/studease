import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Test from './pages/Test';
import TestCreation from './pages/TestCreation';
import TestInfo from './pages/TestInfo';
import SessionDetails from './pages/SessionDetails';
import CollectionCreation from './pages/CollectionCreation';
import CollectionInfo from './pages/CollectionInfo';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={''}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="tests" element={<ProtectedRoute element={<Home />} />} />
        <Route path="collections" element={<ProtectedRoute element={<Home />} />} />
        <Route path=":id" element={<Test />} />
        <Route path="tests/:id" element={<ProtectedRoute element={<TestInfo />} />} />
        <Route path="collections/:name" element={<ProtectedRoute element={<CollectionInfo />} />} />
        <Route path="create-test" element={<ProtectedRoute element={<TestCreation />} />} />
        <Route
          path="create-collection"
          element={<ProtectedRoute element={<CollectionCreation />} />}
        />
        <Route path="create-collection" element={<CollectionCreation />} />
        <Route path="session-details/:id" element={<SessionDetails />} />
        <Route
          path="*"
          element={
            <div>
              <h1>NotFoundPage</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
